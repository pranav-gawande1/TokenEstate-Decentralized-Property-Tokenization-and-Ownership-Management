from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from sqlalchemy import select, or_, func
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from ..models.roles import Role, get_available_roles
from ..services.jwt_handler import create_access_token, verify_password, hash_password
from ..models.models import (
    User,
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    RoleUpdate,
)
from ..services.dependencies import get_current_user, require_roles

auth_router = APIRouter(prefix="/auth", tags=["Authentication & Roles"])
user_router = APIRouter(prefix="/users", tags=["User Role Management"])


@auth_router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register_user(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new TokenEstate user with initial role assignment in PostgreSQL."""
    clean_email = payload.email.strip().lower()
    clean_username = payload.username.strip().lower()

    existing_email = await db.execute(
        select(User).where(func.lower(User.email) == clean_email)
    )
    if existing_email.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    existing_username = await db.execute(
        select(User).where(func.lower(User.username) == clean_username)
    )
    if existing_username.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this username already exists.",
        )

    user = User(
        username=payload.username.strip(),
        email=clean_email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name or payload.username,
        role=payload.role.value if hasattr(payload.role, "value") else str(payload.role),
        wallet_address=payload.wallet_address or "",
        is_active=True,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token({
        "sub": user.email,
        "user_id": user.id,
        "role": user.role,
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=user.to_response(),
    )


@auth_router.post("/login", response_model=TokenResponse)
async def login_user(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    """Authenticate user with username/email and password against PostgreSQL, returning JWT."""
    ident = payload.username_or_email.strip().lower()

    result = await db.execute(
        select(User).where(
            or_(func.lower(User.username) == ident, func.lower(User.email) == ident)
        )
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is currently inactive",
        )

    token = create_access_token({
        "sub": user.email,
        "user_id": user.id,
        "role": user.role,
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=user.to_response(),
    )


@auth_router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    """Fetch current authenticated user profile from DB using Bearer JWT."""
    return current_user.to_response()


@auth_router.get("/roles", response_model=List[Dict[str, Any]])
def list_roles():
    """Returns list of available system roles with titles and descriptions."""
    return get_available_roles()


@user_router.get("", response_model=List[UserResponse])
async def list_all_users(
    admin: User = Depends(require_roles(Role.ADMIN, Role.REGISTRAR)),
    db: AsyncSession = Depends(get_db),
):
    """Admin/Registrar route: List all registered users in PostgreSQL."""
    result = await db.execute(select(User).order_by(User.id))
    users = result.scalars().all()
    return [u.to_response() for u in users]


@user_router.patch("/{user_id}/role", response_model=UserResponse)
async def set_role(
    user_id: int,
    body: RoleUpdate,
    admin: User = Depends(require_roles(Role.ADMIN, Role.REGISTRAR)),
    db: AsyncSession = Depends(get_db),
):
    """Admin/Registrar route: Modify target user's role in the database."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found",
        )

    user.role = body.role.value if hasattr(body.role, "value") else str(body.role)
    await db.commit()
    await db.refresh(user)
    return user.to_response()
