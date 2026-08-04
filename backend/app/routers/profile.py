from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.user import User

from app.core.deps import get_current_user

from app.schemas.profile import (
    ProfileOut,
    ProfileUpdate,
)

from app.crud.profile import (
    get_profile,
    update_profile,
)

router = APIRouter()


@router.get(
    "/me",
    response_model=ProfileOut,
)
def read_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    profile = get_profile(
        db=db,
        user_id=current_user.id,
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found",
        )

    return profile


@router.put(
    "/update",
    response_model=ProfileOut,
)
def edit_profile(
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    profile = get_profile(
        db=db,
        user_id=current_user.id,
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found",
        )

    return update_profile(
        db=db,
        profile=profile,
        profile_data=profile_data,
    )