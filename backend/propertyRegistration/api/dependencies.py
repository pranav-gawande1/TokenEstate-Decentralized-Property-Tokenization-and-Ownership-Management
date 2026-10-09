from dataclasses import dataclass

from fastapi import Depends

from propertyRegistration.core.config import get_settings
from database import get_db
from propertyRegistration.services.blockchain.mock_blockchain_service import MockBlockchainService
from propertyRegistration.services.blockchain.polygon_service import PolygonBlockchainService
from propertyRegistration.services.property_service import PropertyService
from propertyRegistration.utils.wallet import DemoWalletVerificationService, WalletVerificationService

@dataclass(frozen=True)
class AuthenticatedUser:
    user_id: str
    wallet_address: str | None
    role: str

async def get_current_user() -> AuthenticatedUser:
    """Development-only authentication dependency.

    Replace this dependency with the existing application's authenticated-user
    dependency during integration. No login, JWT, password, or session system
    is implemented here.
    """
    settings = get_settings()
    return AuthenticatedUser(
        user_id=settings.demo_user_id,
        wallet_address=settings.demo_wallet_address,
        role=settings.demo_user_role,
    )

def get_wallet_verifier() -> WalletVerificationService:
    return DemoWalletVerificationService()

def get_blockchain_service():
    settings = get_settings()
    if settings.blockchain_service == "polygon":
        return PolygonBlockchainService(settings)
    return MockBlockchainService()

def get_property_service(
    db=Depends(get_db),
    blockchain=Depends(get_blockchain_service),
    wallet_verifier=Depends(get_wallet_verifier),
) -> PropertyService:
    return PropertyService(db, blockchain, wallet_verifier)