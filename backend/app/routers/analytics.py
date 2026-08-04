from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.core.deps import get_current_user

from app.models.user import User
from app.models.income import Income
from app.models.expense import Expense
from app.models.budget import Budget


router = APIRouter()


@router.get("/")
def get_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    total_income = (
        db.query(
            func.coalesce(
                func.sum(Income.amount),
                0,
            )
        )
        .filter(
            Income.user_id == current_user.id
        )
        .scalar()
    )


    total_expense = (
        db.query(
            func.coalesce(
                func.sum(Expense.amount),
                0,
            )
        )
        .filter(
            Expense.user_id == current_user.id
        )
        .scalar()
    )


    top_categories = (
        db.query(
            Expense.category,
            func.sum(Expense.amount).label("total"),
        )
        .filter(
            Expense.user_id == current_user.id
        )
        .group_by(
            Expense.category
        )
        .order_by(
            func.sum(Expense.amount).desc()
        )
        .limit(3)
        .all()
    )


    top_categories_data = [
        {
            "category": row.category,
            "total": row.total,
        }
        for row in top_categories
    ]


    incomes = (
        db.query(Income)
        .filter(
            Income.user_id == current_user.id
        )
        .all()
    )


    expenses = (
        db.query(Expense)
        .filter(
            Expense.user_id == current_user.id
        )
        .all()
    )


    transactions = []


    for income in incomes:
        transactions.append(
            {
                "type": "income",
                "amount": income.amount,
                "category": income.source,
                "date": income.date,
            }
        )


    for expense in expenses:
        transactions.append(
            {
                "type": "expense",
                "amount": expense.amount,
                "category": expense.category,
                "date": expense.date,
            }
        )


    recent_transactions = sorted(
        transactions,
        key=lambda x: x["date"],
        reverse=True,
    )[:5]


    total_budget = (
        db.query(
            func.coalesce(
                func.sum(Budget.monthly_limit),
                0,
            )
        )
        .filter(
            Budget.user_id == current_user.id,
        )
        .scalar()
    )


    balance = total_income - total_expense

    budget_remaining = total_budget - total_expense


    budget_used = (
        (total_expense / total_budget) * 100
        if total_budget > 0
        else 0
    )


    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "total_budget": total_budget,
        "budget_remaining": budget_remaining,
        "budget_used_percent": round(
            budget_used,
            2,
        ),
        "top_categories": top_categories_data,
        "recent_transactions": recent_transactions,
    }