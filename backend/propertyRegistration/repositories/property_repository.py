from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from propertyRegistration.models.property import BlockchainStatus, Property


class PropertyRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, property_record: Property) -> Property:
        self.session.add(property_record)
        await self.session.flush()
        return property_record

    async def get_by_id(self, record_id: UUID) -> Property | None:
        return await self.session.get(Property, record_id)

    async def get_by_property_id(self, property_id: str) -> Property | None:
        result = await self.session.execute(select(Property).where(Property.property_id == property_id))
        return result.scalar_one_or_none()

    async def list_by_user(self, user_id: str, page: int, page_size: int) -> tuple[list[Property], int]:
        base = select(Property).where(Property.owner_user_id == user_id).order_by(Property.created_at.desc())
        count_result = await self.session.execute(select(func.count()).select_from(Property).where(Property.owner_user_id == user_id))
        total = int(count_result.scalar_one())
        result = await self.session.execute(base.offset((page - 1) * page_size).limit(page_size))
        return list(result.scalars().all()), total

    async def exists(self, property_id: str) -> bool:
        return await self.get_by_property_id(property_id) is not None

    async def update_transaction(self, record: Property, **values) -> Property:
        for key, value in values.items():
            setattr(record, key, value)
        await self.session.flush()
        return record

    async def update_blockchain_status(self, record: Property, status: BlockchainStatus) -> Property:
        record.blockchain_status = status
        await self.session.flush()
        return record
