from sqlalchemy.orm import Session

from app.models.income import Income


def get_all_income(
    db: Session,
    user_id: int,
):
    return (
        db.query(Income)
        .filter(Income.user_id == user_id)
        .all()
    )


def get_income(
    db: Session,
    income_id: int,
    user_id: int,
):
    return (
        db.query(Income)
        .filter(
            Income.id == income_id,
            Income.user_id == user_id,
        )
        .first()
    )


def create_income(
    db: Session,
    user_id: int,
    income,
):
    obj = Income(
        user_id=user_id,
        source=income.source,
        amount=income.amount,
        description=income.description,
    )

    db.add(obj)
    db.commit()
    db.refresh(obj)

    return obj


def update_income(
    db: Session,
    income_obj: Income,
    income,
):
    income_obj.source = income.source
    income_obj.amount = income.amount
    income_obj.description = income.description

    db.commit()
    db.refresh(income_obj)

    return income_obj


def delete_income(
    db: Session,
    income_obj: Income,
):
    db.delete(income_obj)
    db.commit()