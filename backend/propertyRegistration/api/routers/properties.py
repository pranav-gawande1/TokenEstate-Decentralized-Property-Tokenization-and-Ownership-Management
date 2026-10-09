from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from propertyRegistration.api.dependencies import AuthenticatedUser, get_current_user, get_property_service
from propertyRegistration.core.exceptions import (
    BlockchainTransactionError, BlockchainVerificationError, InvalidWalletError,
    PropertyAlreadyExistsError, PropertyNotFoundError, UnauthorizedRegistrationError, WalletNotVerifiedError,
)
from propertyRegistration.schemas.property import BlockchainDetailsResponse, PaginatedProperties, PropertyRegistrationRequest, PropertyResponse, VerificationResponse
from propertyRegistration.services.property_service import PropertyService

router = APIRouter(prefix="/api/v1/properties", tags=["Property Registration"])

@router.post("", response_model=PropertyResponse, status_code=201)
async def register_property(
    payload: PropertyRegistrationRequest,
    user: AuthenticatedUser = Depends(get_current_user),
    service: PropertyService = Depends(get_property_service),
):
    try:
        return await service.register_property(user, payload)
    except (PropertyAlreadyExistsError, InvalidWalletError, WalletNotVerifiedError, UnauthorizedRegistrationError, BlockchainTransactionError) as exc:
        from fastapi import HTTPException
        status = 409 if isinstance(exc, PropertyAlreadyExistsError) else 400
        raise HTTPException(status_code=status, detail=str(exc)) from exc


@router.get("", response_model=PaginatedProperties)
async def list_properties(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user: AuthenticatedUser = Depends(get_current_user),
    service: PropertyService = Depends(get_property_service),
):
    items, total = await service.list_properties(user, page, page_size)
    return PaginatedProperties(items=items, page=page, page_size=page_size, total=total)


@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(
    property_id: UUID,
    user: AuthenticatedUser = Depends(get_current_user),
    service: PropertyService = Depends(get_property_service),
):
    try:
        return await service.get_property(property_id, user)
    except PropertyNotFoundError as exc:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{property_id}/blockchain", response_model=BlockchainDetailsResponse)
async def get_blockchain_details(
    property_id: UUID,
    user: AuthenticatedUser = Depends(get_current_user),
    service: PropertyService = Depends(get_property_service),
):
    try:
        record, chain = await service.get_blockchain_details(property_id, user)
        return BlockchainDetailsResponse(
            property_id=record.property_id, blockchain_property_id=record.blockchain_property_id,
            owner=chain.owner, metadata_hash=chain.metadata_hash, transaction_hash=record.transaction_hash,
            block_number=record.block_number, contract_address=record.contract_address,
            chain_id=record.network_chain_id, registration_status=record.registration_status,
        )
    except PropertyNotFoundError as exc:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{property_id}/verify", response_model=VerificationResponse)
async def verify_property(
    property_id: UUID,
    user: AuthenticatedUser = Depends(get_current_user),
    service: PropertyService = Depends(get_property_service),
):
    try:
        database_hash, on_chain_hash, verified = await service.verify_property(property_id, user)
        return VerificationResponse(
            verified=verified, database_hash=database_hash, on_chain_hash=on_chain_hash,
            status="VERIFIED" if verified else "VERIFICATION_FAILED",
        )
    except PropertyNotFoundError as exc:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except BlockchainVerificationError as exc:
        from fastapi import HTTPException
        raise HTTPException(status_code=502, detail="Blockchain verification failed") from exc
