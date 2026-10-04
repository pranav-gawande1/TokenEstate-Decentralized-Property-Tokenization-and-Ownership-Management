from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from .roles import Role, get_available_roles
from .jwt_handler import create_access_token, verify_password
from .models import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    RoleUpdate,
    db,
)
from .dependencies import get_current_user, require_roles

auth_router = APIRouter(prefix="/auth", tags=["Authentication & Roles"])
user_router = APIRouter(prefix="/users", tags=["User Role Management"])

@auth_router.post("/register", response_model=TokenResponse, status_code=status.HTTP_21_CREATED if hasattr(status, "HTTP_21_CREATED") else 201)
def register_user(payload: UserCreate):
    """Register a new TokenEstate user with initial role assignment."""
    if db.get_by_email(payload.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )
        
    if db.get_by_username(payload.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this username already exists.",
        )

    user = db.create_user(
        username=payload.username,
        email=payload.email,
        password=payload.password,
        full_name=payload.full_name or payload.username,
        role=payload.role.value,
        wallet_address=payload.wallet_address or "",
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

@auth_router.post("/login", response_model=TokenResponse)
def login_user(payload: UserLogin):
    """Authenticate user with username/email and password, returning JWT access token."""
    user = db.get_by_username_or_email(payload.username_or_email)
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
def get_my_profile(current_user=Depends(get_current_user)):
    """Fetch current authenticated user profile using Bearer JWT."""
    return current_user.to_response()

@auth_router.get("/roles", response_model=List[Dict[str, Any]])
def list_roles():
    """Returns list of available system roles with titles and descriptions for front-end role dropdowns."""
    return get_available_roles()

@user_router.get("", response_model=List[UserResponse])
def list_all_users(admin=Depends(require_roles(Role.ADMIN, Role.REGISTRAR))):
    """Admin/Registrar route: List all registered users in the platform."""
    return [u.to_response() for u in db.get_all_users()]

@user_router.patch("/{user_id}/role", response_model=UserResponse)
def set_role(
    user_id: int,
    body: RoleUpdate,
    admin=Depends(require_roles(Role.ADMIN, Role.REGISTRAR)),
):
    """Admin/Registrar route: Modify target user's role in the database."""
    user = db.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found",
        )
    
    updated_user = db.update_role(user_id, body.role.value)
    return updated_user.to_response()
