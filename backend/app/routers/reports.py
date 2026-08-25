import csv
import io

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database import get_db
from app.models.budget import Budget
from app.models.expense import Expense
from app.models.income import Income
from app.models.user import User


router = APIRouter()


@router.get("/")
def get_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    incomes = (
        db.query(Income)
        .filter(Income.user_id == current_user.id)
        .all()
    )

    expenses = (
        db.query(Expense)
        .filter(Expense.user_id == current_user.id)
        .all()
    )

    budgets = (
        db.query(Budget)
        .filter(Budget.user_id == current_user.id)
        .all()
    )

    return {
        "income": [
            {
                "id": income.id,
                "amount": float(income.amount or 0),
                "source": income.source,
                "description": "",
                "date": income.date,
            }
            for income in incomes
        ],
        "expenses": [
            {
                "id": expense.id,
                "amount": float(expense.amount or 0),
                "category": expense.category,
                "description": expense.description,
                "date": expense.date,
            }
            for expense in expenses
        ],
        "budgets": [
            {
                "id": budget.id,
                "category": budget.category,
                "monthly_limit": float(
                    budget.monthly_limit or 0
                ),
            }
            for budget in budgets
        ],
    }


@router.get("/export")
def export_reports_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    incomes = (
        db.query(Income)
        .filter(Income.user_id == current_user.id)
        .all()
    )

    expenses = (
        db.query(Expense)
        .filter(Expense.user_id == current_user.id)
        .all()
    )

    budgets = (
        db.query(Budget)
        .filter(Budget.user_id == current_user.id)
        .all()
    )

    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow(
        [
            "type",
            "id",
            "amount",
            "category/source",
            "description",
            "date",
            "monthly_limit",
        ]
    )

    for income in incomes:
        writer.writerow(
            [
                "income",
                income.id,
                float(income.amount or 0),
                income.source or "",
                "",
                income.date,
                "",
            ]
        )

    for expense in expenses:
        writer.writerow(
            [
                "expense",
                expense.id,
                float(expense.amount or 0),
                expense.category or "",
                expense.description or "",
                expense.date,
                "",
            ]
        )

    for budget in budgets:
        writer.writerow(
            [
                "budget",
                budget.id,
                "",
                budget.category or "",
                "",
                "",
                float(budget.monthly_limit or 0),
            ]
        )

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": (
                "attachment; "
                "filename=budgetbuddy_reports.csv"
            )
        },
    )