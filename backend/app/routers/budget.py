from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.deps import get_current_user

from app.models.user import User

from app.schemas.budget import (
    BudgetCreate,
    BudgetUpdate,
    BudgetOut,
)

from app.crud.budget import (
    get_all_budgets,
    get_budget,
    create_budget,
    update_budget,
    delete_budget,
)

router = APIRouter()


@router.get("/", response_model=List[BudgetOut])
def read_budgets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_budgets(
        db,
        current_user.id,
    )


@router.post("/", response_model=BudgetOut)
def add_budget(
    budget: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_budget(
        db,
        current_user.id,
        budget,
    )


@router.put("/{budget_id}", response_model=BudgetOut)
def edit_budget(
    budget_id: int,
    budget: BudgetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    obj = get_budget(
        db,
        budget_id,
        current_user.id,
    )

    if not obj:
        raise HTTPException(
            status_code=404,
            detail="Budget not found",
        )

    return update_budget(
        db,
        obj,
        budget,
    )


@router.delete("/{budget_id}")
def remove_budget(
    budget_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    obj = get_budget(
        db,
        budget_id,
        current_user.id,
    )

    if not obj:
        raise HTTPException(
            status_code=404,
            detail="Budget not found",
        )

    delete_budget(
        db,
        obj,
    )

    return {
        "message": "Budget deleted successfully"
    }