import hashlib
import time

from propertyRegistration.core.exceptions import BlockchainTransactionError, BlockchainVerificationError
from propertyRegistration.services.blockchain.blockchain_interface import (
    BlockchainProperty,
    BlockchainRegistrationResult,
    TransactionStatus,
)


class MockBlockchainService:
    """Deterministic in-memory blockchain double for tests and local development."""

    def __init__(self, *, fail_registration: bool = False, status: TransactionStatus = TransactionStatus.CONFIRMED):
        self.properties: dict[str, BlockchainProperty] = {}
        self.fail_registration = fail_registration
        self.status = status
        self.calls: list[tuple[str, str, str]] = []
        self.contract_address = "0x0000000000000000000000000000000000000001"
        self.chain_id = 31337

    async def register_property(self, property_id: str, owner: str, metadata_hash: str) -> BlockchainRegistrationResult:
        self.calls.append((property_id, owner, metadata_hash))
        if self.fail_registration:
            raise BlockchainTransactionError("Mock blockchain registration failed")
        if property_id in self.properties:
            raise BlockchainTransactionError("Property already exists on mock chain")
        tx = "0x" + hashlib.sha256(property_id.encode()).hexdigest()
        block = 100 + len(self.properties)
        self.properties[property_id] = BlockchainProperty(property_id, owner, metadata_hash, int(time.time()), True)
        return BlockchainRegistrationResult(property_id, owner, metadata_hash, tx, block, self.contract_address, self.chain_id, self.status)

    async def get_property(self, property_id: str) -> BlockchainProperty:
        return self.properties.get(property_id, BlockchainProperty(property_id, "0x0000000000000000000000000000000000000000", "0x" + "0" * 64, 0, False))

    async def verify_property(self, property_id: str, expected_metadata_hash: str) -> bool:
        record = await self.get_property(property_id)
        if not record.exists:
            raise BlockchainVerificationError("Property does not exist on blockchain")
        return record.metadata_hash.lower() == expected_metadata_hash.lower()
