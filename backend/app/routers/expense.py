from datetime import datetime, date

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.crud.expense import (
    create_expense,
    delete_expense,
    get_expense,
    get_expenses_by_user,
    update_expense,
)
from app.crud.notification import create_notification
from app.database import get_db
from app.models.expense import Expense
from app.models.income import Income
from app.models.budget import Budget
from app.models.bank_account import BankAccount
from app.models.user import User
from app.schemas.expense import (
    CategorySummary,
    ExpenseCreate,
    ExpenseOut,
    ExpenseUpdate,
)


router = APIRouter()


# =========================================================
# CREATE EXPENSE
# =========================================================

@router.post(
    "/",
    response_model=ExpenseOut,
    status_code=201
)
def add_expense(
    expense_in: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bank_account = (
        db.query(BankAccount)
        .filter(
            BankAccount.id == expense_in.bank_account_id,
            BankAccount.user_id == current_user.id,
            BankAccount.is_active == True
        )
        .first()
    )

    if not bank_account:
        raise HTTPException(
            status_code=400,
            detail="Invalid or inactive bank account."
        )

    expense = create_expense(
        db,
        current_user.id,
        expense_in
    )

    now = datetime.utcnow()
    month_year = f"{now.year}-{now.month:02d}"

    budget = (
        db.query(Budget)
        .filter(
            Budget.user_id == current_user.id,
            Budget.category == expense.category,
            Budget.month_year == month_year
        )
        .first()
    )

    if budget:

        month_start = datetime(
            now.year,
            now.month,
            1
        )

        if now.month == 12:
            next_month = datetime(
                now.year + 1,
                1,
                1
            )
        else:
            next_month = datetime(
                now.year,
                now.month + 1,
                1
            )

        total_spent = (
            db.query(
                func.coalesce(
                    func.sum(Expense.amount),
                    0
                )
            )
            .filter(
                Expense.user_id == current_user.id,
                Expense.category == expense.category,
                Expense.date >= month_start,
                Expense.date < next_month
            )
            .scalar()
        )

        total_spent = float(
            total_spent or 0
        )

        budget_limit = float(
            budget.monthly_limit or 0
        )

        if budget_limit > 0:

            percentage = (
                total_spent / budget_limit
            ) * 100

            # -------------------------------------------------
            # Budget exceeded
            # -------------------------------------------------

            if percentage >= 100:

                create_notification(
                    db,
                    current_user.id,
                    "Budget Exceeded",
                    f"You have exceeded your "
                    f"{expense.category} budget. "
                    f"Spent ₹{total_spent:.2f} "
                    f"of ₹{budget_limit:.2f}.",
                    "budget_exceeded"
                )

            # -------------------------------------------------
            # 80% budget alert
            # -------------------------------------------------

            elif percentage >= 80:

                create_notification(
                    db,
                    current_user.id,
                    "Budget Alert",
                    f"You have used "
                    f"{percentage:.0f}% of your "
                    f"{expense.category} budget. "
                    f"Spent ₹{total_spent:.2f} "
                    f"of ₹{budget_limit:.2f}.",
                    "budget_alert"
                )

    return expense


# =========================================================
# LIST EXPENSES
# =========================================================

@router.get(
    "/",
    response_model=list[ExpenseOut]
)
def list_expenses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_expenses_by_user(
        db,
        current_user.id,
        skip,
        limit
    )


# =========================================================
# EXPENSE SUMMARY
# =========================================================

@router.get(
    "/summary",
    response_model=list[CategorySummary]
)
def expense_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = (
        db.query(
            Expense.category,
            func.sum(
                Expense.amount
            ).label("total")
        )
        .filter(
            Expense.user_id == current_user.id
        )
        .group_by(
            Expense.category
        )
        .order_by(
            func.sum(
                Expense.amount
            ).desc()
        )
        .all()
    )

    return [
        {
            "category": category,
            "total": float(total or 0)
        }
        for category, total in results
    ]


# =========================================================
# DASHBOARD
# =========================================================

@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    now = datetime.utcnow()

    # ---------------------------------------------------------
    # Current month range
    # ---------------------------------------------------------

    month_start = datetime(
        now.year,
        now.month,
        1
    )

    if now.month == 12:

        next_month = datetime(
            now.year + 1,
            1,
            1
        )

    else:

        next_month = datetime(
            now.year,
            now.month + 1,
            1
        )

    # ---------------------------------------------------------
    # Current month income
    # ---------------------------------------------------------

    total_income = (
        db.query(
            func.coalesce(
                func.sum(Income.amount),
                0
            )
        )
        .filter(
            Income.user_id == current_user.id,
            Income.date >= month_start,
            Income.date < next_month
        )
        .scalar()
    )

    # ---------------------------------------------------------
    # Current month expenses
    # ---------------------------------------------------------

    total_expenses = (
        db.query(
            func.coalesce(
                func.sum(Expense.amount),
                0
            )
        )
        .filter(
            Expense.user_id == current_user.id,
            Expense.date >= month_start,
            Expense.date < next_month
        )
        .scalar()
    )

    # ---------------------------------------------------------
    # Current month total budget
    # ---------------------------------------------------------

    month_year = f"{now.year}-{now.month:02d}"

    total_budget = (
        db.query(
            func.coalesce(
                func.sum(Budget.monthly_limit),
                0
            )
        )
        .filter(
            Budget.user_id == current_user.id,
            Budget.month_year == month_year
        )
        .scalar()
    )

    # ---------------------------------------------------------
    # Convert values
    # ---------------------------------------------------------

    total_income = float(
        total_income or 0
    )

    total_expenses = float(
        total_expenses or 0
    )

    total_budget = float(
        total_budget or 0
    )

    # ---------------------------------------------------------
    # Total balance
    #
    # Income - Expenses
    # ---------------------------------------------------------

    balance = (
        total_income -
        total_expenses
    )

    # ---------------------------------------------------------
    # Budget remaining
    #
    # Total monthly budget - monthly expenses
    # ---------------------------------------------------------

    budget_remaining = (
        total_budget -
        total_expenses
    )

    # Prevent negative remaining budget
    if budget_remaining < 0:
        budget_remaining = 0.0

    # ---------------------------------------------------------
    # Top spending categories
    # ---------------------------------------------------------

    top_categories = (
        db.query(
            Expense.category,
            func.sum(
                Expense.amount
            ).label("total")
        )
        .filter(
            Expense.user_id == current_user.id,
            Expense.date >= month_start,
            Expense.date < next_month
        )
        .group_by(
            Expense.category
        )
        .order_by(
            func.sum(
                Expense.amount
            ).desc()
        )
        .limit(3)
        .all()
    )

    # ---------------------------------------------------------
    # All expenses
    # ---------------------------------------------------------

    expenses = (
        db.query(Expense)
        .filter(
            Expense.user_id == current_user.id
        )
        .all()
    )

    # ---------------------------------------------------------
    # All incomes
    # ---------------------------------------------------------

    incomes = (
        db.query(Income)
        .filter(
            Income.user_id == current_user.id
        )
        .all()
    )

    # ---------------------------------------------------------
    # Build transactions
    # ---------------------------------------------------------

    transactions = []

    for expense in expenses:

        transactions.append(
            {
                "id": expense.id,
                "type": "expense",
                "category": expense.category,
                "title": (
                    expense.description
                    or expense.category
                ),
                "amount": float(
                    expense.amount or 0
                ),
                "date": expense.date,
                "bank_account_id":
                    expense.bank_account_id,
            }
        )

    for income in incomes:

        transactions.append(
            {
                "id": income.id,
                "type": "income",
                "category": income.source,
                "title": income.source,
                "amount": float(
                    income.amount or 0
                ),
                "date": income.date,
                "bank_account_id":
                    income.bank_account_id,
            }
        )

    # ---------------------------------------------------------
    # Sort transactions newest first
    # ---------------------------------------------------------

    transactions.sort(
        key=lambda x: (
            x["date"].date()
            if isinstance(
                x["date"],
                datetime
            )
            else x["date"]
            if isinstance(
                x["date"],
                date
            )
            else date.min
        ),
        reverse=True
    )

    recent_transactions = transactions[:5]

    # ---------------------------------------------------------
    # Dashboard response
    # ---------------------------------------------------------

    return {
        "total_income": total_income,

        "total_expenses": total_expenses,

        "balance": balance,

        "total_budget": total_budget,

        "budget_remaining": budget_remaining,

        "top_categories": [
            {
                "category": category,
                "total": float(
                    total or 0
                )
            }
            for category, total in top_categories
        ],

        "recent_transactions":
            recent_transactions
    }


# =========================================================
# GET SINGLE EXPENSE
# =========================================================

@router.get(
    "/{expense_id}",
    response_model=ExpenseOut
)
def get_single_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expense = get_expense(
        db,
        expense_id,
        current_user.id
    )

    if not expense:

        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    return expense


# =========================================================
# UPDATE EXPENSE
# =========================================================

@router.put(
    "/{expense_id}",
    response_model=ExpenseOut
)
def edit_expense(
    expense_id: int,
    expense_in: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expense = get_expense(
        db,
        expense_id,
        current_user.id
    )

    if not expense:

        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    if expense_in.bank_account_id is not None:

        bank_account = (
            db.query(BankAccount)
            .filter(
                BankAccount.id ==
                expense_in.bank_account_id,

                BankAccount.user_id ==
                current_user.id,

                BankAccount.is_active ==
                True
            )
            .first()
        )

        if not bank_account:

            raise HTTPException(
                status_code=400,
                detail="Invalid or inactive bank account."
            )

    expense = update_expense(
        db,
        expense_id,
        current_user.id,
        expense_in
    )

    if not expense:

        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    return expense


# =========================================================
# DELETE EXPENSE
# =========================================================

@router.delete(
    "/{expense_id}"
)
def remove_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expense = delete_expense(
        db,
        expense_id,
        current_user.id
    )

    if not expense:

        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    return {
        "message":
            "Expense deleted successfully"
    }