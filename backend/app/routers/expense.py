from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.expense import Expense

from app.database import get_db

from app.models.user import User

from app.core.deps import get_current_user

from app.schemas.expense import (
    ExpenseCreate,
    ExpenseOut,
    ExpenseUpdate,
)

from app.crud.expense import (
    get_all_expenses,
    get_expense,
    create_expense,
    update_expense,
    delete_expense,
)

router = APIRouter()


@router.get("/", response_model=list[ExpenseOut])
def list_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_all_expenses(
        db=db,
        user_id=current_user.id,
    )


@router.get("/summary")
def expense_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    result = (
        db.query(
            Expense.category,
            func.sum(Expense.amount).label("total"),
        )
        .filter(
            Expense.user_id == current_user.id
        )
        .group_by(
            Expense.category
        )
        .all()
    )

    return [
        {
            "category": row.category,
            "total": row.total,
        }
        for row in result
    ]
    
@router.get("/{expense_id}", response_model=ExpenseOut)
def get_expense_by_id(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = get_expense(
        db=db,
        expense_id=expense_id,
        user_id=current_user.id,
    )

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    return expense


@router.post("/", response_model=ExpenseOut)
def add_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_expense(
        db=db,
        user_id=current_user.id,
        expense=expense,
    )


@router.put("/{expense_id}", response_model=ExpenseOut)
def edit_expense(
    expense_id: int,
    expense: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense_obj = get_expense(
        db=db,
        expense_id=expense_id,
        user_id=current_user.id,
    )

    if not expense_obj:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    return update_expense(
        db=db,
        expense_obj=expense_obj,
        expense=expense,
    )


@router.delete("/{expense_id}")
def remove_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense_obj = get_expense(
        db=db,
        expense_id=expense_id,
        user_id=current_user.id,
    )

    if not expense_obj:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    delete_expense(
        db=db,
        expense_obj=expense_obj,
    )

    return {
        "message": "Expense deleted successfully"
    }
    