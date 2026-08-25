from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.crud.income import (
    create_income,
    delete_income,
    get_income,
    get_incomes_by_user,
    update_income,
)
from app.database import get_db
from app.models.bank_account import BankAccount
from app.models.user import User
from app.schemas.income import (
    IncomeCreate,
    IncomeOut,
    IncomeUpdate,
)


router = APIRouter()


@router.post(
    "/",
    response_model=IncomeOut,
    status_code=201
)
def add_income(
    income_in: IncomeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bank_account = (
        db.query(BankAccount)
        .filter(
            BankAccount.id == income_in.bank_account_id,
            BankAccount.user_id == current_user.id,
            BankAccount.is_active == True
        )
        .first()
    )

    if not bank_account:
        raise HTTPException(
            status_code=400,
            detail="Invalid or inactive bank account."
        )

    return create_income(
        db,
        current_user.id,
        income_in
    )


@router.get(
    "/",
    response_model=list[IncomeOut]
)
def list_incomes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_incomes_by_user(
        db,
        current_user.id,
        skip,
        limit
    )


@router.get(
    "/{income_id}",
    response_model=IncomeOut
)
def get_single_income(
    income_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    income = get_income(
        db,
        income_id,
        current_user.id
    )

    if not income:
        raise HTTPException(
            status_code=404,
            detail="Income not found"
        )

    return income


@router.put(
    "/{income_id}",
    response_model=IncomeOut
)
def edit_income(
    income_id: int,
    income_in: IncomeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    income = get_income(
        db,
        income_id,
        current_user.id
    )

    if not income:
        raise HTTPException(
            status_code=404,
            detail="Income not found"
        )

    if income_in.bank_account_id is not None:
        bank_account = (
            db.query(BankAccount)
            .filter(
                BankAccount.id == income_in.bank_account_id,
                BankAccount.user_id == current_user.id,
                BankAccount.is_active == True
            )
            .first()
        )

        if not bank_account:
            raise HTTPException(
                status_code=400,
                detail="Invalid or inactive bank account."
            )

    income = update_income(
        db,
        income_id,
        current_user.id,
        income_in
    )

    if not income:
        raise HTTPException(
            status_code=404,
            detail="Income not found"
        )

    return income


@router.delete(
    "/{income_id}"
)
def remove_income(
    income_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    income = delete_income(
        db,
        income_id,
        current_user.id
    )

    if not income:
        raise HTTPException(
            status_code=404,
            detail="Income not found"
        )

    return {
        "message": "Income deleted successfully"
    }