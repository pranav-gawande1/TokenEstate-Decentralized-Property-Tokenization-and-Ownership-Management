
from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PropertyRegistrationRequest(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    survey_number: str = Field(min_length=1, max_length=100)
    property_type: str = Field(min_length=1, max_length=50)
    address: str = Field(min_length=1, max_length=1000)
    city: str = Field(min_length=1, max_length=100)
    district: str = Field(min_length=1, max_length=100)
    state: str = Field(min_length=1, max_length=100)
    pin_code: str = Field(pattern=r"^\d{6}$")
    area: Decimal = Field(gt=0, max_digits=18, decimal_places=4)
    land_type: str = Field(min_length=1, max_length=100)

    latitude: Decimal | None = Field(
        default=None, ge=-90, le=90, max_digits=10, decimal_places=7
    )
    longitude: Decimal | None = Field(
        default=None, ge=-180, le=180, max_digits=10, decimal_places=7
    )

    ownership_type: str = Field(
        default="Sole Ownership", min_length=1, max_length=50
    )
    registration_date: date | None = None
    government_registration_ref: str | None = Field(
        default=None, max_length=150
    )
    valuation_in_inr: Decimal | None = Field(
        default=None, gt=0, max_digits=20, decimal_places=2
    )


class PropertyResponse(PropertyRegistrationRequest):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    property_id: str
    owner_user_id: str
    owner_wallet: str

    metadata_hash: str
    blockchain_property_id: str
    transaction_hash: str | None
    block_number: int | None
    contract_address: str | None
    network_chain_id: int | None

    registration_status: str
    blockchain_status: str
    created_at: datetime
    updated_at: datetime


class PaginatedProperties(BaseModel):
    items: list[PropertyResponse]
    page: int
    page_size: int
    total: int


class BlockchainDetailsResponse(BaseModel):
    property_id: str
    blockchain_property_id: str
    owner: str
    metadata_hash: str
    transaction_hash: str | None
    block_number: int | None
    contract_address: str | None
    chain_id: int | None
    registration_status: str


class VerificationResponse(BaseModel):
    verified: bool
    database_hash: str
    on_chain_hash: str | None
    status: str