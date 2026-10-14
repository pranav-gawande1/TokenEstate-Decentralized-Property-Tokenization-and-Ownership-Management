from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from sqlalchemy import Boolean, DateTime, Integer, String, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from database import Base
from .roles import Role
from ..services.jwt_handler import hash_password


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = ""
    role: Role = Role.OWNER
    wallet_address: Optional[str] = ""


class UserLogin(BaseModel):
    username_or_email: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    wallet_address: str
    is_active: bool


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class RoleUpdate(BaseModel):
    role: Role


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(200), default="", nullable=False)
    role: Mapped[str] = mapped_column(String(50), default=Role.OWNER.value, nullable=False)
    wallet_address: Mapped[str] = mapped_column(String(100), default="", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "hashed_password": self.hashed_password,
            "full_name": self.full_name,
            "role": self.role,
            "wallet_address": self.wallet_address,
            "is_active": self.is_active,
        }

    def to_response(self) -> UserResponse:
        return UserResponse(
            id=self.id,
            username=self.username,
            email=self.email,
            full_name=self.full_name,
            role=self.role,
            wallet_address=self.wallet_address or "",
            is_active=self.is_active,
        )


DEMO_USERS = [
    {
        "username": "admin",
        "email": "admin@tokenestate.io",
        "password": "adminpassword123",
        "full_name": "System Administrator",
        "role": Role.ADMIN.value,
        "wallet_address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    },
    {
        "username": "officer_patel",
        "email": "officer@tokenestate.io",
        "password": "officerpassword123",
        "full_name": "Cadastral Officer Patel",
        "role": Role.OFFICER.value,
        "wallet_address": "0x3C44CdDDB6a900fa2b585dd299e03d12FA4293BC",
    },
    {
        "username": "registrar_main",
        "email": "registrar@tokenestate.io",
        "password": "registrarpassword123",
        "full_name": "Chief Land Registrar",
        "role": Role.REGISTRAR.value,
        "wallet_address": "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    },
    {
        "username": "owner_sharma",
        "email": "owner@tokenestate.io",
        "password": "ownerpassword123",
        "full_name": "Vikram Sharma (Seller)",
        "role": Role.OWNER.value,
        "wallet_address": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    },
    {
        "username": "buyer_verma",
        "email": "buyer@tokenestate.io",
        "password": "buyerpassword123",
        "full_name": "Ananya Verma (Investor)",
        "role": Role.BUYER.value,
        "wallet_address": "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    },
    {
        "username": "auditor_kulkarni",
        "email": "auditor@tokenestate.io",
        "password": "auditorpassword123",
        "full_name": "Dr. Ramesh Kulkarni (Auditor)",
        "role": Role.AUDITOR.value,
        "wallet_address": "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    },
]


async def seed_demo_users_if_needed(session: AsyncSession) -> None:
    """Seeds institutional and demo users into the PostgreSQL database if not present."""
    for acc in DEMO_USERS:
        result = await session.execute(
            select(User).where(func.lower(User.email) == acc["email"].lower())
        )
        existing = result.scalar_one_or_none()
        if not existing:
            user = User(
                username=acc["username"],
                email=acc["email"],
                hashed_password=hash_password(acc["password"]),
                full_name=acc["full_name"],
                role=acc["role"],
                wallet_address=acc["wallet_address"],
                is_active=True,
            )
            session.add(user)
    await session.commit()
