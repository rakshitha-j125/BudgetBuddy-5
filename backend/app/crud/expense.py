from sqlalchemy.orm import Session

from app.models.expense import Expense


def get_all_expenses(
    db: Session,
    user_id: int,
):
    return (
        db.query(Expense)
        .filter(Expense.user_id == user_id)
        .all()
    )


def get_expense(
    db: Session,
    expense_id: int,
    user_id: int,
):
    return (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.user_id == user_id,
        )
        .first()
    )


def create_expense(
    db: Session,
    user_id: int,
    expense,
):
    obj = Expense(
        user_id=user_id,
        category=expense.category,
        amount=expense.amount,
        description=expense.description,
    )

    db.add(obj)
    db.commit()
    db.refresh(obj)

    return obj


def update_expense(
    db: Session,
    expense_obj: Expense,
    expense,
):
    expense_obj.category = expense.category
    expense_obj.amount = expense.amount
    expense_obj.description = expense.description

    db.commit()
    db.refresh(expense_obj)

    return expense_obj


def delete_expense(
    db: Session,
    expense_obj: Expense,
):
    db.delete(expense_obj)
    db.commit()