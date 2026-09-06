from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.deps import get_admin_user
from app.database import get_db
from app.models import User, Expense, Income

router = APIRouter()


@router.get("/system-analytics")
def get_system_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(get_admin_user),
):
    total_users = db.query(User).count()

    student_users = (
        db.query(User)
        .filter(User.role == "student")
        .count()
    )

    premium_users = (
        db.query(User)
        .filter(User.role == "premium")
        .count()
    )

    admin_users = (
        db.query(User)
        .filter(User.role == "admin")
        .count()
    )

    active_users = (
        db.query(User)
        .filter(User.is_active == True)
        .count()
    )

    inactive_users = (
        db.query(User)
        .filter(User.is_active == False)
        .count()
    )

    total_income = (
        db.query(func.coalesce(func.sum(Income.amount), 0))
        .scalar()
    )

    total_expenses = (
        db.query(func.coalesce(func.sum(Expense.amount), 0))
        .scalar()
    )

    return {
        "total_users": total_users,
        "student_users": student_users,
        "premium_users": premium_users,
        "admin_users": admin_users,
        "active_users": active_users,
        "inactive_users": inactive_users,
        "total_income": float(total_income or 0),
        "total_expenses": float(total_expenses or 0),
    }


@router.get("/users")
def get_users(
    db: Session = Depends(get_db),
    current_user=Depends(get_admin_user),
):
    users = (
        db.query(User)
        .order_by(User.id.desc())
        .all()
    )

    return [
        {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
        }
        for user in users
    ]


@router.put("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    role: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_admin_user),
):
    allowed_roles = ["student", "premium", "admin"]

    if role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role",
        )

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.id == current_user.id and role != "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot remove your own admin role",
        )

    user.role = role

    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active,
    }


@router.put("/users/{user_id}/status")
def update_user_status(
    user_id: int,
    is_active: bool,
    db: Session = Depends(get_db),
    current_user=Depends(get_admin_user),
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.id == current_user.id and not is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot deactivate your own admin account",
        )

    user.is_active = is_active

    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active,
    }