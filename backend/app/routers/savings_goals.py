from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.crud.savings_goal import (
    contribute_to_goal,
    create_savings_goal,
    delete_savings_goal,
    get_savings_goal,
    get_savings_goals,
    update_savings_goal,
)
from app.database import get_db
from app.models.user import User
from app.schemas.savings_goal import (
    SavingsContribution,
    SavingsGoalCreate,
    SavingsGoalOut,
    SavingsGoalUpdate,
)

router = APIRouter()


@router.post(
    "/",
    response_model=SavingsGoalOut,
    status_code=status.HTTP_201_CREATED
)
def create_goal(
    goal_in: SavingsGoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_savings_goal(
        db,
        current_user.id,
        goal_in
    )


@router.get(
    "/",
    response_model=list[SavingsGoalOut]
)
def list_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_savings_goals(
        db,
        current_user.id
    )


@router.get(
    "/{goal_id}",
    response_model=SavingsGoalOut
)
def get_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = get_savings_goal(
        db,
        goal_id,
        current_user.id
    )

    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Savings goal not found"
        )

    return goal


@router.put(
    "/{goal_id}",
    response_model=SavingsGoalOut
)
def edit_goal(
    goal_id: int,
    goal_in: SavingsGoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = get_savings_goal(
        db,
        goal_id,
        current_user.id
    )

    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Savings goal not found"
        )

    return update_savings_goal(
        db,
        goal,
        goal_in
    )


@router.post(
    "/{goal_id}/contribute",
    response_model=SavingsGoalOut
)
def contribute(
    goal_id: int,
    contribution: SavingsContribution,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = get_savings_goal(
        db,
        goal_id,
        current_user.id
    )

    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Savings goal not found"
        )

    return contribute_to_goal(
        db=db,
        goal=goal,
        amount=Decimal(contribution.amount),
        bank_account_id=contribution.bank_account_id,
        user_id=current_user.id
    )


@router.delete(
    "/{goal_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def remove_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = get_savings_goal(
        db,
        goal_id,
        current_user.id
    )

    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Savings goal not found"
        )

    delete_savings_goal(
        db,
        goal
    )

    return None