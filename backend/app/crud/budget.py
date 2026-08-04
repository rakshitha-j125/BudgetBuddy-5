from sqlalchemy.orm import Session

from app.models.budget import Budget


def get_budget(
    db: Session,
    budget_id: int,
    user_id: int,
):
    return (
        db.query(Budget)
        .filter(
            Budget.id == budget_id,
            Budget.user_id == user_id,
        )
        .first()
    )


def get_all_budgets(
    db: Session,
    user_id: int,
):
    return (
        db.query(Budget)
        .filter(Budget.user_id == user_id)
        .all()
    )


def create_budget(
    db: Session,
    user_id: int,
    budget,
):
    obj = Budget(
        user_id=user_id,
        category=budget.category,
        monthly_limit=budget.monthly_limit,
    )

    db.add(obj)
    db.commit()
    db.refresh(obj)

    return obj


def update_budget(
    db: Session,
    budget_obj: Budget,
    budget,
):
    budget_obj.category = budget.category
    budget_obj.monthly_limit = budget.monthly_limit

    db.commit()
    db.refresh(budget_obj)

    return budget_obj


def delete_budget(
    db: Session,
    budget_obj: Budget,
):
    db.delete(budget_obj)
    db.commit()