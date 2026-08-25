from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.crud.bank_account import (
    create_bank_account,
    delete_bank_account,
    get_bank_account,
    get_bank_accounts,
    get_duplicate_bank_account,
    update_bank_account,
)
from app.database import get_db
from app.models.user import User
from app.schemas.bank_account import (
    BankAccountCreate,
    BankAccountOut,
    BankAccountUpdate,
)

router = APIRouter()


@router.get(
    "/",
    response_model=list[BankAccountOut],
)
def list_bank_accounts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_bank_accounts(
        db=db,
        user_id=current_user.id,
    )


@router.post(
    "/",
    response_model=BankAccountOut,
    status_code=status.HTTP_201_CREATED,
)
def add_bank_account(
    account: BankAccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = get_duplicate_bank_account(
        db=db,
        user_id=current_user.id,
        bank_name=account.bank_name,
        account_type=account.account_type,
        account_number_last4=account.account_number_last4,
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This bank account already exists.",
        )

    return create_bank_account(
        db=db,
        user_id=current_user.id,
        account=account,
    )


@router.get(
    "/{account_id}",
    response_model=BankAccountOut,
)
def get_single_bank_account(
    account_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    account = get_bank_account(
        db=db,
        account_id=account_id,
        user_id=current_user.id,
    )

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bank account not found.",
        )

    return account


@router.put(
    "/{account_id}",
    response_model=BankAccountOut,
)
def edit_bank_account(
    account_id: int,
    account: BankAccountUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_account = get_bank_account(
        db=db,
        account_id=account_id,
        user_id=current_user.id,
    )

    if not db_account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bank account not found.",
        )

    update_data = account.model_dump(exclude_unset=True)

    bank_name = update_data.get(
        "bank_name",
        db_account.bank_name,
    )

    account_type = update_data.get(
        "account_type",
        db_account.account_type,
    )

    account_number_last4 = update_data.get(
        "account_number_last4",
        db_account.account_number_last4,
    )

    duplicate = (
        get_duplicate_bank_account(
            db=db,
            user_id=current_user.id,
            bank_name=bank_name,
            account_type=account_type,
            account_number_last4=account_number_last4,
        )
    )

    if duplicate and duplicate.id != db_account.id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Another bank account with these details already exists.",
        )

    return update_bank_account(
        db=db,
        db_account=db_account,
        account=account,
    )


@router.delete(
    "/{account_id}",
)
def remove_bank_account(
    account_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    account = get_bank_account(
        db=db,
        account_id=account_id,
        user_id=current_user.id,
    )

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bank account not found.",
        )

    if account.expenses or account.incomes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bank account cannot be deleted because it has linked transactions.",
        )

    delete_bank_account(
        db=db,
        db_account=account,
    )

    return {
        "message": "Bank account deleted successfully."
    }