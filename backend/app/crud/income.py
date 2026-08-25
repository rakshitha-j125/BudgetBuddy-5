from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.bank_account import BankAccount
from app.models.income import Income
from app.schemas.income import (
    IncomeCreate,
    IncomeUpdate,
)


def create_income(
    db: Session,
    user_id: int,
    income_in: IncomeCreate
):
    data = income_in.model_dump(
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

    amount = Decimal(
        str(data["amount"])
    )

    income = Income(
        user_id=user_id,
        bank_account_id=data["bank_account_id"],
        source=data["source"],
        amount=data["amount"],
        date=data.get("date"),
        notes=data.get("notes"),
    )

    bank_account.balance = (
        Decimal(
            str(bank_account.balance or 0)
        )
        + amount
    )

    db.add(income)
    db.commit()
    db.refresh(income)

    return income


def get_incomes_by_user(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 100
):
    return (
        db.query(Income)
        .filter(
            Income.user_id == user_id
        )
        .order_by(
            Income.date.desc()
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_income(
    db: Session,
    income_id: int,
    user_id: int
):
    return (
        db.query(Income)
        .filter(
            Income.id == income_id,
            Income.user_id == user_id
        )
        .first()
    )


def update_income(
    db: Session,
    income_id: int,
    user_id: int,
    income_in: IncomeUpdate
):
    income = get_income(
        db,
        income_id,
        user_id
    )

    if not income:
        return None

    data = income_in.model_dump(
        exclude_unset=True
    )

    old_amount = Decimal(
        str(income.amount)
    )

    old_bank_account = (
        db.query(BankAccount)
        .filter(
            BankAccount.id == income.bank_account_id,
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

    new_bank_account_id = income.bank_account_id

    if "bank_account_id" in data:
        new_bank_account_id = data["bank_account_id"]

    if new_bank_account_id != income.bank_account_id:
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

        old_bank_account.balance = (
            Decimal(
                str(old_bank_account.balance or 0)
            )
            - old_amount
        )

        new_bank_account.balance = (
            Decimal(
                str(new_bank_account.balance or 0)
            )
            + new_amount
        )

    else:
        difference = new_amount - old_amount

        if difference > 0:
            old_bank_account.balance = (
                Decimal(
                    str(old_bank_account.balance or 0)
                )
                + difference
            )

        elif difference < 0:
            decrease = abs(difference)

            if (
                Decimal(
                    str(old_bank_account.balance or 0)
                )
                < decrease
            ):
                raise HTTPException(
                    status_code=400,
                    detail="Insufficient bank account balance."
                )

            old_bank_account.balance = (
                Decimal(
                    str(old_bank_account.balance or 0)
                )
                - decrease
            )

    for key, value in data.items():
        setattr(
            income,
            key,
            value
        )

    db.commit()
    db.refresh(income)

    return income


def delete_income(
    db: Session,
    income_id: int,
    user_id: int
):
    income = get_income(
        db,
        income_id,
        user_id
    )

    if not income:
        return None

    bank_account = (
        db.query(BankAccount)
        .filter(
            BankAccount.id == income.bank_account_id,
            BankAccount.user_id == user_id
        )
        .first()
    )

    if bank_account:
        amount = Decimal(
            str(income.amount)
        )

        bank_account.balance = (
            Decimal(
                str(bank_account.balance or 0)
            )
            - amount
        )

    db.delete(income)
    db.commit()

    return income