from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.user import User

from app.core.deps import get_current_user
from app.core.security import (
    verify_password,
    create_access_token,
)

from app.schemas.user import (
    UserCreate,
    UserOut,
)

from app.schemas.auth import Token

from app.crud.user import (
    get_user_by_email,
    create_user,
)

router = APIRouter()


@router.post("/signup", response_model=UserOut)
def signup(
    user_in: UserCreate,
    db: Session = Depends(get_db),
):

    if get_user_by_email(db, user_in.email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    return create_user(
        db=db,
        full_name=user_in.full_name,
        email=user_in.email,
        password=user_in.password,
    )


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):

    user = get_user_by_email(
        db,
        form_data.username,
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    if not verify_password(
        form_data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    token = create_access_token(
        {
            "sub": user.email,
            "role": user.role,
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
    }


@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified,
    }