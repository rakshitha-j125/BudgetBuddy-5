from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.bank_account import BankAccount
from app.models.expense import Expense
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
)


def create_expense(
    db: Session,
    user_id: int,
    expense_in: ExpenseCreate
):
    data = expense_in.model_dump(
        exclude_none=True
    )

    bank_account = (
        db.query(BankAccount)
        .filter(
            BankAccount.id == data["bank_account_id"],
            BankAccount.user_id == user_id,
            BankAccount.is_active == True
        )
        .first()
    )

    if not bank_account:
        raise HTTPException(
            status_code=400,
            detail="Invalid or inactive bank account."
        )

    amount = Decimal(str(data["amount"]))

    if Decimal(str(bank_account.balance or 0)) < amount:
        raise HTTPException(
            status_code=400,
            detail="Insufficient bank account balance."
        )

    expense = Expense(
        user_id=user_id,
        bank_account_id=data["bank_account_id"],
        category=data["category"],
        amount=data["amount"],
        description=data.get("description"),
        date=data.get("date"),
    )

    bank_account.balance = (
        Decimal(str(bank_account.balance or 0))
        - amount
    )

    db.add(expense)
    db.commit()
    db.refresh(expense)

    return expense


def get_expenses_by_user(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 100
):
    return (
        db.query(Expense)
        .filter(
            Expense.user_id == user_id
        )
        .order_by(
            Expense.date.desc()
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_expense(
    db: Session,
    expense_id: int,
    user_id: int
):
    return (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.user_id == user_id
        )
        .first()
    )


def update_expense(
    db: Session,
    expense_id: int,
    user_id: int,
    expense_in: ExpenseUpdate
):
    expense = get_expense(
        db,
        expense_id,
        user_id
    )

    if not expense:
        return None

    data = expense_in.model_dump(
        exclude_unset=True
    )

    old_amount = Decimal(
        str(expense.amount)
    )

    old_bank_account = (
        db.query(BankAccount)
        .filter(
            BankAccount.id == expense.bank_account_id,
            BankAccount.user_id == user_id
        )
        .first()
    )

    if not old_bank_account:
        raise HTTPException(
            status_code=400,
            detail="Current bank account is invalid."
        )

    new_amount = old_amount

    if "amount" in data:
        new_amount = Decimal(
            str(data["amount"])
        )

    new_bank_account_id = expense.bank_account_id

    if "bank_account_id" in data:
        new_bank_account_id = data["bank_account_id"]

    new_bank_account = old_bank_account

    if new_bank_account_id != expense.bank_account_id:
        new_bank_account = (
            db.query(BankAccount)
            .filter(
                BankAccount.id == new_bank_account_id,
                BankAccount.user_id == user_id,
                BankAccount.is_active == True
            )
            .first()
        )

        if not new_bank_account:
            raise HTTPException(
                status_code=400,
                detail="Invalid or inactive bank account."
            )

        if (
            Decimal(str(new_bank_account.balance or 0))
            < new_amount
        ):
            raise HTTPException(
                status_code=400,
                detail="Insufficient balance in the selected bank account."
            )

        old_bank_account.balance = (
            Decimal(
                str(old_bank_account.balance or 0)
            )
            + old_amount
        )

        new_bank_account.balance = (
            Decimal(
                str(new_bank_account.balance or 0)
            )
            - new_amount
        )

    else:
        difference = new_amount - old_amount

        if difference > 0:
            if (
                Decimal(
                    str(old_bank_account.balance or 0)
                )
                < difference
            ):
                raise HTTPException(
                    status_code=400,
                    detail="Insufficient bank account balance."
                )

            old_bank_account.balance = (
                Decimal(
                    str(old_bank_account.balance or 0)
                )
                - difference
            )

        elif difference < 0:
            old_bank_account.balance = (
                Decimal(
                    str(old_bank_account.balance or 0)
                )
                + abs(difference)
            )

    for key, value in data.items():
        setattr(
            expense,
            key,
            value
        )

    db.commit()
    db.refresh(expense)

    return expense


def delete_expense(
    db: Session,
    expense_id: int,
    user_id: int
):
    expense = get_expense(
        db,
        expense_id,
        user_id
    )

    if not expense:
        return None

    bank_account = (
        db.query(BankAccount)
        .filter(
            BankAccount.id == expense.bank_account_id,
            BankAccount.user_id == user_id
        )
        .first()
    )

    if bank_account:
        bank_account.balance = (
            Decimal(
                str(bank_account.balance or 0)
            )
            + Decimal(str(expense.amount))
        )

    db.delete(expense)
    db.commit()

    return expense