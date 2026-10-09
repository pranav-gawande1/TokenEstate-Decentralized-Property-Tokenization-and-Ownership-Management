import enum
import uuid
from datetime import datetime, date

from sqlalchemy import DateTime, Index, Integer, Numeric, String, Text, func, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class RegistrationStatus(str, enum.Enum):
    PENDING_BLOCKCHAIN = "PENDING_BLOCKCHAIN"
    REGISTERED = "REGISTERED"
    RECONCILIATION_REQUIRED = "RECONCILIATION_REQUIRED"
    FAILED = "FAILED"


class BlockchainStatus(str, enum.Enum):
    NOT_SUBMITTED = "NOT_SUBMITTED"
    SUBMITTED = "SUBMITTED"
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    FAILED = "FAILED"
    CONFIRMATION_TIMEOUT = "CONFIRMATION_TIMEOUT"


class Property(Base):
    __tablename__ = "properties"
    __table_args__ = (
        Index("ix_properties_owner_user_id", "owner_user_id"),
        Index("ix_properties_owner_wallet", "owner_wallet"),
        Index("ix_properties_transaction_hash", "transaction_hash"),
        Index("ix_properties_registration_status", "registration_status"),
        Index("ix_properties_blockchain_status", "blockchain_status"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    property_id: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    owner_user_id: Mapped[str] = mapped_column(String(128), nullable=False)
    owner_wallet: Mapped[str] = mapped_column(String(42), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    ownership_type: Mapped[str] = mapped_column(
        String(50), nullable=False, default="Sole Ownership"
    )
    registration_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    government_registration_ref: Mapped[str | None] = mapped_column(
        String(150), nullable=True
    )
    valuation_in_inr: Mapped[float | None] = mapped_column(
        Numeric(20, 2), nullable=True
    )
    survey_number: Mapped[str] = mapped_column(String(100), nullable=False)
    property_type: Mapped[str] = mapped_column(String(50), nullable=False)
    address: Mapped[str] = mapped_column(Text, nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    pin_code: Mapped[str] = mapped_column(String(10), nullable=False)
    area: Mapped[float] = mapped_column(Numeric(18, 4), nullable=False)
    land_type: Mapped[str] = mapped_column(String(50), nullable=False)
    latitude: Mapped[float | None] = mapped_column(Numeric(10, 7), nullable=True)
    longitude: Mapped[float | None] = mapped_column(Numeric(10, 7), nullable=True)
    metadata_hash: Mapped[str] = mapped_column(String(66), nullable=False)
    blockchain_property_id: Mapped[str] = mapped_column(String(66), nullable=False)
    transaction_hash: Mapped[str | None] = mapped_column(String(66), nullable=True)
    block_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    contract_address: Mapped[str | None] = mapped_column(String(42), nullable=True)
    network_chain_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    registration_status: Mapped[RegistrationStatus] = mapped_column(
        String(40), nullable=False
    )
    blockchain_status: Mapped[BlockchainStatus] = mapped_column(
        String(40), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
