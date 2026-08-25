from sqlalchemy.orm import Session

from app.models.budget import Budget
from app.schemas.budget import (
    BudgetCreate,
    BudgetUpdate,
)


def create_budget(
    db: Session,
    user_id: int,
    budget_in: BudgetCreate
):

    data = budget_in.model_dump()

    budget = Budget(
        user_id=user_id,
        **data
    )

    db.add(budget)
    db.commit()
    db.refresh(budget)

    return budget


def get_budgets_by_user(
    db: Session,
    user_id: int
):

    return (
        db.query(Budget)
        .filter(Budget.user_id == user_id)
        .order_by(Budget.month_year.desc())
        .all()
    )


def get_budget(
    db: Session,
    budget_id: int,
    user_id: int
):

    return (
        db.query(Budget)
        .filter(
            Budget.id == budget_id,
            Budget.user_id == user_id
        )
        .first()
    )


def update_budget(
    db: Session,
    budget_id: int,
    user_id: int,
    budget_in: BudgetUpdate
):

    budget = get_budget(
        db,
        budget_id,
        user_id
    )

    if not budget:
        return None

    data = budget_in.model_dump(
        exclude_unset=True
    )

    for key, value in data.items():
        setattr(
            budget,
            key,
            value
        )

    db.commit()
    db.refresh(budget)

    return budget


def delete_budget(
    db: Session,
    budget_id: int,
    user_id: int
):

    budget = get_budget(
        db,
        budget_id,
        user_id
    )

    if not budget:
        return None

    db.delete(budget)
    db.commit()

    return budget