from sqlalchemy.orm import Session

from app.models.bank_account import BankAccount
from app.schemas.bank_account import (
    BankAccountCreate,
    BankAccountUpdate,
)


def get_bank_accounts(
    db: Session,
    user_id: int,
):
    return (
        db.query(BankAccount)
        .filter(BankAccount.user_id == user_id)
        .order_by(BankAccount.id.desc())
        .all()
    )


def get_bank_account(
    db: Session,
    account_id: int,
    user_id: int,
):
    return (
        db.query(BankAccount)
        .filter(
            BankAccount.id == account_id,
            BankAccount.user_id == user_id,
        )
        .first()
    )


def get_duplicate_bank_account(
    db: Session,
    user_id: int,
    bank_name: str,
    account_type: str,
    account_number_last4: str,
):
    return (
        db.query(BankAccount)
        .filter(
            BankAccount.user_id == user_id,
            BankAccount.bank_name == bank_name,
            BankAccount.account_type == account_type,
            BankAccount.account_number_last4 == account_number_last4,
        )
        .first()
    )


def create_bank_account(
    db: Session,
    user_id: int,
    account: BankAccountCreate,
):
    existing = get_duplicate_bank_account(
        db=db,
        user_id=user_id,
        bank_name=account.bank_name,
        account_type=account.account_type,
        account_number_last4=account.account_number_last4,
    )

    if existing:
        return None

    db_account = BankAccount(
        user_id=user_id,
        bank_name=account.bank_name,
        account_name=account.account_name,
        account_type=account.account_type,
        account_number_last4=account.account_number_last4,
        balance=account.balance,
        currency=account.currency,
        is_active=account.is_active,
    )

    db.add(db_account)
    db.commit()
    db.refresh(db_account)

    return db_account


def update_bank_account(
    db: Session,
    db_account: BankAccount,
    account: BankAccountUpdate,
):
    update_data = account.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(db_account, field, value)

    db.commit()
    db.refresh(db_account)

    return db_account


def delete_bank_account(
    db: Session,
    db_account: BankAccount,
):
    db.delete(db_account)
    db.commit()