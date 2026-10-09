from dataclasses import dataclass
from enum import StrEnum
from typing import Protocol


class TransactionStatus(StrEnum):
    NOT_SUBMITTED = "NOT_SUBMITTED"
    SUBMITTED = "SUBMITTED"
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    FAILED = "FAILED"
    CONFIRMATION_TIMEOUT = "CONFIRMATION_TIMEOUT"


@dataclass(frozen=True)
class BlockchainRegistrationResult:
    property_id: str
    owner: str
    metadata_hash: str
    transaction_hash: str | None
    block_number: int | None
    contract_address: str | None
    chain_id: int | None
    status: TransactionStatus


@dataclass(frozen=True)
class BlockchainProperty:
    property_id: str
    owner: str
    metadata_hash: str
    registered_at: int
    exists: bool


class BlockchainService(Protocol):
    async def register_property(self, property_id: str, owner: str, metadata_hash: str) -> BlockchainRegistrationResult: ...
    async def get_property(self, property_id: str) -> BlockchainProperty: ...
    async def verify_property(self, property_id: str, expected_metadata_hash: str) -> bool: ...