from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.deps import get_current_user

from app.models.user import User

from app.schemas.income import (
    IncomeCreate,
    IncomeUpdate,
    IncomeOut,
)

from app.crud.income import (
    get_all_income,
    get_income,
    create_income,
    update_income,
    delete_income,
)

router = APIRouter()


@router.get("/", response_model=List[IncomeOut])
def read_income(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_income(db, current_user.id)


@router.post("/", response_model=IncomeOut)
def add_income(
    income: IncomeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_income(
        db,
        current_user.id,
        income,
    )


@router.put("/{income_id}", response_model=IncomeOut)
def edit_income(
    income_id: int,
    income: IncomeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    obj = get_income(
        db,
        income_id,
        current_user.id,
    )

    if not obj:
        raise HTTPException(
            status_code=404,
            detail="Income not found",
        )

    return update_income(
        db,
        obj,
        income,
    )


@router.delete("/{income_id}")
def remove_income(
    income_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    obj = get_income(
        db,
        income_id,
        current_user.id,
    )

    if not obj:
        raise HTTPException(
            status_code=404,
            detail="Income not found",
        )

    delete_income(
        db,
        obj,
    )

    return {
        "message": "Income deleted successfully"
    }