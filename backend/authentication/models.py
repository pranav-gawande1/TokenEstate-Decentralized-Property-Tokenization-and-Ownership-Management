import json
import os
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, EmailStr
from .roles import Role
from .jwt_handler import hash_password

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

class User:
    def __init__(
        self,
        id: int,
        username: str,
        email: str,
        hashed_password: str,
        full_name: str = "",
        role: str = Role.OWNER.value,
        wallet_address: str = "",
        is_active: bool = True,
    ):
        self.id = id
        self.username = username
        self.email = email
        self.hashed_password = hashed_password
        self.full_name = full_name
        self.role = role
        self.wallet_address = wallet_address
        self.is_active = is_active

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
            wallet_address=self.wallet_address,
            is_active=self.is_active,
        )


class UserDBStore:
    """In-memory user repository seeded with institutional & demo accounts."""
    
    def __init__(self):
        self.users: Dict[int, User] = {}
        self._next_id = 1
        self._seed_demo_users()

    def _seed_demo_users(self):
        demo_accounts = [
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

        for acc in demo_accounts:
            self.create_user(
                username=acc["username"],
                email=acc["email"],
                password=acc["password"],
                full_name=acc["full_name"],
                role=acc["role"],
                wallet_address=acc["wallet_address"],
            )

    def create_user(
        self,
        username: str,
        email: str,
        password: str,
        full_name: str = "",
        role: str = Role.OWNER.value,
        wallet_address: str = "",
    ) -> User:
        user_id = self._next_id
        self._next_id += 1
        hashed = hash_password(password)
        user = User(
            id=user_id,
            username=username,
            email=email,
            hashed_password=hashed,
            full_name=full_name,
            role=role,
            wallet_address=wallet_address,
            is_active=True,
        )
        self.users[user_id] = user
        return user

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.users.get(user_id)

    def get_by_username_or_email(self, identifier: str) -> Optional[User]:
        identifier_lower = identifier.strip().lower()
        for user in self.users.values():
            if user.username.lower() == identifier_lower or user.email.lower() == identifier_lower:
                return user
        return None

    def get_by_email(self, email: str) -> Optional[User]:
        email_lower = email.strip().lower()
        for user in self.users.values():
            if user.email.lower() == email_lower:
                return user
        return None

    def get_by_username(self, username: str) -> Optional[User]:
        username_lower = username.strip().lower()
        for user in self.users.values():
            if user.username.lower() == username_lower:
                return user
        return None

    def update_role(self, user_id: int, new_role: str) -> Optional[User]:
        user = self.get_by_id(user_id)
        if user:
            user.role = new_role
            return user
        return None

    def get_all_users(self) -> List[User]:
        return list(self.users.values())

# Global database instance
db = UserDBStore()
