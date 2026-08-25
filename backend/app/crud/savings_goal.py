from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud.notification import create_notification
from app.models.bank_account import BankAccount
from app.models.savings_goal import SavingsGoal
from app.schemas.savings_goal import (
    SavingsGoalCreate,
    SavingsGoalUpdate,
)


def get_savings_goals(
    db: Session,
    user_id: int
):
    return (
        db.query(SavingsGoal)
        .filter(
            SavingsGoal.user_id == user_id
        )
        .order_by(
            SavingsGoal.created_at.desc()
        )
        .all()
    )


def get_savings_goal(
    db: Session,
    goal_id: int,
    user_id: int
):
    return (
        db.query(SavingsGoal)
        .filter(
            SavingsGoal.id == goal_id,
            SavingsGoal.user_id == user_id
        )
        .first()
    )


def create_savings_goal(
    db: Session,
    user_id: int,
    goal_in: SavingsGoalCreate
):
    if goal_in.target_amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Target amount must be greater than zero"
        )

    goal = SavingsGoal(
        user_id=user_id,
        name=goal_in.name,
        target_amount=goal_in.target_amount,
        current_amount=Decimal("0.00"),
        deadline=goal_in.deadline
    )

    db.add(goal)
    db.commit()
    db.refresh(goal)

    return goal


def update_savings_goal(
    db: Session,
    goal: SavingsGoal,
    goal_in: SavingsGoalUpdate
):
    if (
        goal_in.target_amount is not None
        and goal_in.target_amount <= 0
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Target amount must be greater than zero"
        )

    update_data = goal_in.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            goal,
            field,
            value
        )

    db.commit()
    db.refresh(goal)

    return goal


def delete_savings_goal(
    db: Session,
    goal: SavingsGoal
):
    db.delete(goal)
    db.commit()


def contribute_to_goal(
    db: Session,
    goal: SavingsGoal,
    amount: Decimal,
    bank_account_id: int,
    user_id: int
):
    # Validate contribution amount
    if amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contribution amount must be greater than zero"
        )

    # Convert database values safely to Decimal
    target = Decimal(
        str(goal.target_amount)
    )

    current = Decimal(
        str(goal.current_amount)
    )

    # Calculate remaining amount
    remaining_amount = target - current

    # Prevent contribution above target
    if amount > remaining_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contribution exceeds the remaining goal amount"
        )

    # Find user's active bank account
    bank_account = (
        db.query(BankAccount)
        .filter(
            BankAccount.id == bank_account_id,
            BankAccount.user_id == user_id,
            BankAccount.is_active == True
        )
        .first()
    )

    if not bank_account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or inactive bank account"
        )

    # Check bank balance
    bank_balance = Decimal(
        str(bank_account.balance or 0)
    )

    if bank_balance < amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient bank account balance"
        )

    # Deduct money from bank account
    bank_account.balance = (
        bank_balance - amount
    )

    # Add money to savings goal
    goal.current_amount = (
        current + amount
    )

    # New saved amount
    new_current = Decimal(
        str(goal.current_amount)
    )

    # Calculate old and new percentage
    old_percentage = (
        (current / target) * 100
        if target > 0
        else Decimal("0")
    )

    new_percentage = (
        (new_current / target) * 100
        if target > 0
        else Decimal("0")
    )

    # --------------------------------
    # 50% SAVINGS GOAL NOTIFICATION
    # --------------------------------
    if old_percentage < 50 <= new_percentage:
        create_notification(
            db,
            user_id,
            "Savings Goal 50% Reached",
            (
                f"You're halfway there! You have saved "
                f"₹{new_current:.2f} of "
                f"₹{target:.2f} for "
                f"'{goal.name}'."
            ),
            "savings_goal_50_percent"
        )

    # --------------------------------
    # 80% SAVINGS GOAL NOTIFICATION
    # --------------------------------
    if old_percentage < 80 <= new_percentage:
        create_notification(
            db,
            user_id,
            "Savings Goal 80% Reached",
            (
                f"You're close to your goal! You have saved "
                f"₹{new_current:.2f} of "
                f"₹{target:.2f} for "
                f"'{goal.name}'."
            ),
            "savings_goal_80_percent"
        )

    # --------------------------------
    # 100% SAVINGS GOAL NOTIFICATION
    # --------------------------------
    if old_percentage < 100 <= new_percentage:
        create_notification(
            db,
            user_id,
            "Savings Goal Completed",
            (
                f"Congratulations! You reached your "
                f"'{goal.name}' savings goal of "
                f"₹{target:.2f}."
            ),
            "savings_goal_completed"
        )

    # Save everything together
    db.commit()
    db.refresh(goal)

    return goal