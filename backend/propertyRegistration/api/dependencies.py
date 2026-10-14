from dataclasses import dataclass

from fastapi import Depends, Request, HTTPException, status

from propertyRegistration.core.config import get_settings
from database import get_db
from propertyRegistration.services.blockchain.mock_blockchain_service import MockBlockchainService
from propertyRegistration.services.blockchain.polygon_service import PolygonBlockchainService
from propertyRegistration.services.property_service import PropertyService
from propertyRegistration.utils.wallet import DemoWalletVerificationService, WalletVerificationService
from authentication.services.jwt_handler import decode_access_token


@dataclass(frozen=True)
class AuthenticatedUser:
    user_id: str
    wallet_address: str | None
    role: str


async def get_current_user(request: Request) -> AuthenticatedUser:
    """Extracts authenticated user from Authorization header if present,
    falling back to configured demo settings when no token is supplied.
    """
    settings = get_settings()
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1].strip()
        payload = decode_access_token(token)
        if payload:
            return AuthenticatedUser(
                user_id=str(payload.get("user_id", settings.demo_user_id)),
                wallet_address=settings.demo_wallet_address,
                role=str(payload.get("role", settings.demo_user_role)).lower(),
            )

    return AuthenticatedUser(
        user_id=settings.demo_user_id,
        wallet_address=settings.demo_wallet_address,
        role=settings.demo_user_role.lower(),
    )


def require_property_roles(*allowed_roles: str):
    """Dependency enforcing role permissions on property and verification endpoints."""
    allowed_set = {r.lower() for r in allowed_roles}

    async def checker(user: AuthenticatedUser = Depends(get_current_user)) -> AuthenticatedUser:
        user_role = (user.role or "").lower()
        if user_role not in allowed_set and "admin" not in user_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied. Action restricted. Your role '{user.role}' is not authorized.",
            )
        return user

    return checker


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