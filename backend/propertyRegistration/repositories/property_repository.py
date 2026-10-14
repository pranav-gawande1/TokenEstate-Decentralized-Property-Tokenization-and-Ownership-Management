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

    async def list_properties(
        self,
        page: int = 1,
        page_size: int = 20,
        owner_user_id: str | None = None,
        status: str | None = None,
        search: str | None = None,
    ) -> tuple[list[Property], int]:
        from sqlalchemy import and_, or_

        filters = []
        if owner_user_id:
            filters.append(Property.owner_user_id == owner_user_id)

        if status and status.strip():
            s = status.strip().upper()
            filters.append(
                or_(
                    Property.registration_status == s,
                    Property.blockchain_status == s,
                )
            )

        if search and search.strip():
            term = f"%{search.strip().lower()}%"
            filters.append(
                or_(
                    func.lower(Property.title).like(term),
                    func.lower(Property.survey_number).like(term),
                    func.lower(Property.city).like(term),
                    func.lower(Property.property_id).like(term),
                )
            )

        base = select(Property).order_by(Property.created_at.desc())
        count_stmt = select(func.count()).select_from(Property)

        if filters:
            base = base.where(and_(*filters))
            count_stmt = count_stmt.where(and_(*filters))

        total_result = await self.session.execute(count_stmt)
        total = int(total_result.scalar_one())

        result = await self.session.execute(base.offset((page - 1) * page_size).limit(page_size))
        return list(result.scalars().all()), total

    async def list_by_user(self, user_id: str, page: int, page_size: int) -> tuple[list[Property], int]:
        return await self.list_properties(page=page, page_size=page_size, owner_user_id=user_id)

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
