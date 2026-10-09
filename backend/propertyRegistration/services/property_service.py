from decimal import Decimal
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from propertyRegistration.core.exceptions import PropertyAlreadyExistsError, PropertyNotFoundError, UnauthorizedRegistrationError, WalletNotVerifiedError
from propertyRegistration.models.property import BlockchainStatus, Property, RegistrationStatus
from propertyRegistration.repositories.property_repository import PropertyRepository
from propertyRegistration.schemas.property import PropertyRegistrationRequest
from propertyRegistration.services.blockchain.blockchain_interface import BlockchainService, TransactionStatus
from propertyRegistration.utils.metadata_hash import metadata_sha256
from propertyRegistration.utils.wallet import WalletVerificationService, validate_wallet_address


class PropertyService:
    def __init__(self, db: AsyncSession, blockchain: BlockchainService, wallet_verifier: WalletVerificationService):
        self.repository = PropertyRepository(db)
        self.db = db
        self.blockchain = blockchain
        self.wallet_verifier = wallet_verifier

    @staticmethod
    def _make_property_id(user_id: str, survey_number: str) -> str:
        import hashlib
        suffix = hashlib.sha256(f"{user_id}:{survey_number}".encode()).hexdigest()[:16]
        return f"PROP-{suffix.upper()}"

    
    @staticmethod
    def _metadata(record: PropertyRegistrationRequest, property_id: str) -> dict:
        return {
            "version": 1,
            "property_id": property_id,
            "title": record.title,
            "survey_number": record.survey_number,
            "property_type": record.property_type,
            "address": record.address,
            "city": record.city,
            "district": record.district,
            "state": record.state,
            "pin_code": record.pin_code,
            "area": record.area,
            "land_type": record.land_type,
            "latitude": record.latitude,
            "longitude": record.longitude,
            "ownership_type": record.ownership_type,
            "registration_date": (
                record.registration_date.isoformat()
                if record.registration_date
                else None
            ),
            "government_registration_ref": record.government_registration_ref,
            "valuation_in_inr": record.valuation_in_inr,
        }

    async def register_property(self, user, data: PropertyRegistrationRequest) -> Property:
        if not user.wallet_address:
            raise UnauthorizedRegistrationError("Authenticated user has no associated wallet")
        validate_wallet_address(user.wallet_address)
        if not await self.wallet_verifier.verify_wallet_ownership(user.user_id, user.wallet_address):
            raise WalletNotVerifiedError("Wallet ownership could not be verified")

        property_id = self._make_property_id(user.user_id, data.survey_number)
        if await self.repository.exists(property_id):
            raise PropertyAlreadyExistsError("Property already registered")

        metadata_hash = metadata_sha256(self._metadata(data, property_id))
        blockchain_property_id = "0x" + __import__("web3").Web3.keccak(text=property_id).hex()[2:]
        record = Property(
            title=data.title,
            ownership_type=data.ownership_type,
            registration_date=data.registration_date,
            government_registration_ref=data.government_registration_ref,
            valuation_in_inr=data.valuation_in_inr,
            property_id=property_id,
            owner_user_id=user.user_id,
            owner_wallet=user.wallet_address,
            survey_number=data.survey_number,
            property_type=data.property_type,
            address=data.address,
            city=data.city,
            district=data.district,
            state=data.state,
            pin_code=data.pin_code,
            area=data.area,
            land_type=data.land_type,
            latitude=data.latitude,
            longitude=data.longitude,
            metadata_hash=metadata_hash,
            blockchain_property_id=blockchain_property_id,
            registration_status=RegistrationStatus.PENDING_BLOCKCHAIN.value,
            blockchain_status=BlockchainStatus.NOT_SUBMITTED.value,
        )
        await self.repository.create(record)
        await self.db.commit()

        try:
            result = await self.blockchain.register_property(property_id, user.wallet_address, metadata_hash)
        except Exception:
            record.registration_status = RegistrationStatus.RECONCILIATION_REQUIRED.value
            record.blockchain_status = BlockchainStatus.FAILED.value
            await self.db.commit()
            raise

        record.transaction_hash = result.transaction_hash
        record.block_number = result.block_number
        record.contract_address = result.contract_address
        record.network_chain_id = result.chain_id
        record.blockchain_status = result.status.value
        if result.status == TransactionStatus.CONFIRMED:
            record.registration_status = RegistrationStatus.REGISTERED.value
        elif result.status == TransactionStatus.CONFIRMATION_TIMEOUT:
            record.registration_status = RegistrationStatus.RECONCILIATION_REQUIRED.value
        else:
            record.registration_status = RegistrationStatus.FAILED.value
        await self.db.commit()
        await self.db.refresh(record)
        return record

    async def get_property(self, record_id: UUID, user) -> Property:
        record = await self.repository.get_by_id(record_id)
        if not record or record.owner_user_id != user.user_id:
            raise PropertyNotFoundError("Property not found")
        return record

    async def list_properties(self, user, page: int, page_size: int):
        return await self.repository.list_by_user(user.user_id, page, page_size)

    async def get_blockchain_details(self, record_id: UUID, user):
        record = await self.get_property(record_id, user)
        chain_record = await self.blockchain.get_property(record.property_id)
        return record, chain_record

    async def verify_property(self, record_id: UUID, user):
        record = await self.get_property(record_id, user)
        
        metadata = {
            "version": 1,
            "property_id": record.property_id,
            "title": record.title,
            "survey_number": record.survey_number,
            "property_type": record.property_type,
            "address": record.address,
            "city": record.city,
            "district": record.district,
            "state": record.state,
            "pin_code": record.pin_code,
            "area": Decimal(str(record.area)),
            "land_type": record.land_type,
            "latitude": (
                Decimal(str(record.latitude))
                if record.latitude is not None
                else None
            ),
            "longitude": (
                Decimal(str(record.longitude))
                if record.longitude is not None
                else None
            ),
            "ownership_type": record.ownership_type,
            "registration_date": (
                record.registration_date.isoformat()
                if record.registration_date
                else None
            ),
            "government_registration_ref": record.government_registration_ref,
            "valuation_in_inr": (
                Decimal(str(record.valuation_in_inr))
                if record.valuation_in_inr is not None
                else None
            ),
        }
        database_hash = metadata_sha256(metadata)
        chain = await self.blockchain.get_property(record.property_id)
        verified = database_hash.lower() == record.metadata_hash.lower() and chain.exists and chain.metadata_hash.lower() == database_hash.lower()
        return database_hash, chain.metadata_hash if chain.exists else None, verified
