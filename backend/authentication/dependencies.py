from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from .roles import Role
from .jwt_handler import decode_access_token
from .models import db, User

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """
    Extracts Bearer JWT from Authorization header, decodes it,
    and returns the authenticated user instance.
    """
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("user_id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload missing user identity",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    user = db.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Authenticated user account no longer exists",
        )
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated",
        )
        
    return user

def require_roles(*allowed: Role):
    """
    Dependency factory enforcing Role-Based Access Control (RBAC).
    Raises HTTP 403 Forbidden if user's role is not within the allowed set.
    """
    allowed_values = {r.value for r in allowed}

    def checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in allowed_values:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied. Action requires one of roles: {list(allowed_values)}. Current role: '{user.role}'",
            )
        return user

    return checker