from datetime import date

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)
from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from app.core.deps import (
    get_current_user,
    get_premium_user,
)
from app.database import get_db
from app.models.expense import Expense
from app.models.income import Income
from app.models.savings_goal import SavingsGoal
from app.models.user import User


router = APIRouter()


# =========================================================
# SUMMARY
# =========================================================

@router.get("/summary")
def get_summary(
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

    total_expenses = (
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

    total_income = float(total_income or 0)
    total_expenses = float(total_expenses or 0)

    balance = (
        total_income -
        total_expenses
    )

    savings_rate = (
        (balance / total_income) * 100
        if total_income > 0
        else 0
    )

    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "balance": balance,
        "savings_rate": max(
            savings_rate,
            0,
        ),
    }


# =========================================================
# EXPENSE ANALYTICS
# =========================================================

@router.get("/expenses")
def get_expense_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total = (
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

    count = (
        db.query(
            func.count(Expense.id)
        )
        .filter(
            Expense.user_id == current_user.id
        )
        .scalar()
    )

    average = (
        db.query(
            func.coalesce(
                func.avg(Expense.amount),
                0,
            )
        )
        .filter(
            Expense.user_id == current_user.id
        )
        .scalar()
    )

    return {
        "total_expenses": float(
            total or 0
        ),
        "expense_count": int(
            count or 0
        ),
        "average_expense": float(
            average or 0
        ),
    }


# =========================================================
# INCOME ANALYTICS
# =========================================================

@router.get("/income")
def get_income_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total = (
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

    count = (
        db.query(
            func.count(Income.id)
        )
        .filter(
            Income.user_id == current_user.id
        )
        .scalar()
    )

    average = (
        db.query(
            func.coalesce(
                func.avg(Income.amount),
                0,
            )
        )
        .filter(
            Income.user_id == current_user.id
        )
        .scalar()
    )

    return {
        "total_income": float(
            total or 0
        ),
        "income_count": int(
            count or 0
        ),
        "average_income": float(
            average or 0
        ),
    }


# =========================================================
# CATEGORY ANALYTICS
# =========================================================

@router.get("/categories")
def get_category_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    results = (
        db.query(
            Expense.category,
            func.sum(
                Expense.amount
            ).label("total"),
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
            "category": (
                category
                if category
                else "Other"
            ),
            "total": float(
                total or 0
            ),
        }
        for category, total in results
    ]


# =========================================================
# MONTHLY TRENDS
# =========================================================

@router.get("/monthly-trends")
def get_monthly_trends(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expenses = (
        db.query(
            extract(
                "year",
                Expense.date,
            ).label("year"),

            extract(
                "month",
                Expense.date,
            ).label("month"),

            func.sum(
                Expense.amount
            ).label("total"),
        )
        .filter(
            Expense.user_id == current_user.id
        )
        .group_by(
            extract(
                "year",
                Expense.date,
            ),
            extract(
                "month",
                Expense.date,
            ),
        )
        .order_by(
            extract(
                "year",
                Expense.date,
            ),
            extract(
                "month",
                Expense.date,
            ),
        )
        .all()
    )

    incomes = (
        db.query(
            extract(
                "year",
                Income.date,
            ).label("year"),

            extract(
                "month",
                Income.date,
            ).label("month"),

            func.sum(
                Income.amount
            ).label("total"),
        )
        .filter(
            Income.user_id == current_user.id
        )
        .group_by(
            extract(
                "year",
                Income.date,
            ),
            extract(
                "month",
                Income.date,
            ),
        )
        .order_by(
            extract(
                "year",
                Income.date,
            ),
            extract(
                "month",
                Income.date,
            ),
        )
        .all()
    )

    data = {}

    for year, month, total in expenses:
        key = (
            f"{int(year)}-"
            f"{int(month):02d}"
        )

        data.setdefault(
            key,
            {
                "month": key,
                "income": 0.0,
                "expenses": 0.0,
            },
        )

        data[key]["expenses"] = float(
            total or 0
        )

    for year, month, total in incomes:
        key = (
            f"{int(year)}-"
            f"{int(month):02d}"
        )

        data.setdefault(
            key,
            {
                "month": key,
                "income": 0.0,
                "expenses": 0.0,
            },
        )

        data[key]["income"] = float(
            total or 0
        )

    return sorted(
        data.values(),
        key=lambda item: item["month"],
    )


# =========================================================
# SAVINGS ANALYTICS
# =========================================================

@router.get("/savings")
def get_savings_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goals = (
        db.query(SavingsGoal)
        .filter(
            SavingsGoal.user_id ==
            current_user.id
        )
        .all()
    )

    total_target = sum(
        float(
            goal.target_amount or 0
        )
        for goal in goals
    )

    total_saved = sum(
        float(
            goal.current_amount or 0
        )
        for goal in goals
    )

    overall_progress = (
        (
            total_saved /
            total_target
        ) * 100
        if total_target > 0
        else 0
    )

    return {
        "goal_count": len(goals),

        "total_target": total_target,

        "total_saved": total_saved,

        "overall_progress": min(
            overall_progress,
            100,
        ),

        "goals": [
            {
                "id": goal.id,

                "name": goal.name,

                "target_amount": float(
                    goal.target_amount or 0
                ),

                "current_amount": float(
                    goal.current_amount or 0
                ),

                "progress": min(
                    (
                        float(
                            goal.current_amount or 0
                        )
                        /
                        float(
                            goal.target_amount
                        )
                    ) * 100,
                    100,
                )
                if float(
                    goal.target_amount or 0
                ) > 0
                else 0,

                "deadline": goal.deadline,
            }
            for goal in goals
        ],
    }


# =========================================================
# FINANCIAL INSIGHTS
# =========================================================

@router.get("/insights")
def get_financial_insights(
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

    total_expenses = (
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

    total_income = float(
        total_income or 0
    )

    total_expenses = float(
        total_expenses or 0
    )

    if total_income > 0:

        expense_ratio = (
            total_expenses /
            total_income
        ) * 100

        savings_rate = (
            (
                total_income -
                total_expenses
            )
            /
            total_income
        ) * 100

    else:
        expense_ratio = 0
        savings_rate = 0

    if (
        total_income == 0
        and total_expenses == 0
    ):
        status_message = (
            "Start recording your "
            "income and expenses."
        )

    elif total_income == 0:

        status_message = (
            "Add your income records "
            "to understand your "
            "financial health."
        )

    elif expense_ratio >= 100:

        status_message = (
            "Your expenses are higher "
            "than your income. "
            "Review your spending."
        )

    elif expense_ratio >= 80:

        status_message = (
            "Your expenses are high. "
            "Try reducing unnecessary "
            "spending."
        )

    elif expense_ratio >= 60:

        status_message = (
            "Your spending is moderate. "
            "Keep monitoring your "
            "expenses."
        )

    else:

        status_message = (
            "Great job! Your spending "
            "is under control."
        )

    return {
        "expense_ratio": round(
            expense_ratio,
            2,
        ),

        "savings_rate": round(
            savings_rate,
            2,
        ),

        "status": status_message,
    }


# =========================================================
# PREMIUM ANALYTICS
# =========================================================


# =========================================================
# 1. CUSTOM DATE RANGE
# =========================================================

@router.get("/date-range")
def get_date_range_analytics(
    start_date: date = Query(...),
    end_date: date = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_premium_user
    ),
):
    if start_date > end_date:
        raise HTTPException(
            status_code=400,
            detail=(
                "Start date cannot be "
                "after end date."
            ),
        )

    incomes = (
        db.query(Income)
        .filter(
            Income.user_id == current_user.id,
            Income.date >= start_date,
            Income.date <= end_date,
        )
        .order_by(
            Income.date.asc()
        )
        .all()
    )

    expenses = (
        db.query(Expense)
        .filter(
            Expense.user_id == current_user.id,
            Expense.date >= start_date,
            Expense.date <= end_date,
        )
        .order_by(
            Expense.date.asc()
        )
        .all()
    )

    total_income = sum(
        float(item.amount or 0)
        for item in incomes
    )

    total_expenses = sum(
        float(item.amount or 0)
        for item in expenses
    )

    balance = (
        total_income -
        total_expenses
    )

    savings_rate = (
        (
            balance /
            total_income
        ) * 100
        if total_income > 0
        else 0
    )

    category_totals = {}

    for expense in expenses:

        category = (
            expense.category.strip()
            if expense.category
            else "Other"
        )

        category_key = category.lower()

        if category_key not in category_totals:
            category_totals[
                category_key
            ] = {
                "category": category.title(),
                "total": 0.0,
            }

        category_totals[
            category_key
        ]["total"] += float(
            expense.amount or 0
        )

    categories = sorted(
        category_totals.values(),
        key=lambda item: item["total"],
        reverse=True,
    )

    return {
        "start_date": start_date,
        "end_date": end_date,

        "days": (
            end_date -
            start_date
        ).days + 1,

        "summary": {
            "total_income": total_income,

            "total_expenses": total_expenses,

            "balance": balance,

            "savings_rate": round(
                max(savings_rate, 0),
                2,
            ),
        },

        "income_count": len(
            incomes
        ),

        "expense_count": len(
            expenses
        ),

        "average_income": (
            total_income /
            len(incomes)
            if incomes
            else 0
        ),

        "average_expense": (
            total_expenses /
            len(expenses)
            if expenses
            else 0
        ),

        "categories": categories,
    }


# =========================================================
# 2. CATEGORY BREAKDOWN OVER TIME
# =========================================================

@router.get("/category-over-time")
def get_category_breakdown_over_time(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_premium_user
    ),
):
    results = (
        db.query(
            extract(
                "year",
                Expense.date,
            ).label("year"),

            extract(
                "month",
                Expense.date,
            ).label("month"),

            Expense.category,

            func.sum(
                Expense.amount
            ).label("total"),
        )
        .filter(
            Expense.user_id == current_user.id
        )
        .group_by(
            extract(
                "year",
                Expense.date,
            ),
            extract(
                "month",
                Expense.date,
            ),
            Expense.category,
        )
        .order_by(
            extract(
                "year",
                Expense.date,
            ),
            extract(
                "month",
                Expense.date,
            ),
        )
        .all()
    )

    data = {}

    for (
        year,
        month,
        category,
        total,
    ) in results:

        month_key = (
            f"{int(year)}-"
            f"{int(month):02d}"
        )

        category_name = (
            category.strip()
            if category
            else "Other"
        )

        category_name = (
            category_name.title()
        )

        data.setdefault(
            month_key,
            {
                "month": month_key,
                "categories": {},
            },
        )

        data[
            month_key
        ]["categories"][
            category_name
        ] = float(
            data[
                month_key
            ]["categories"].get(
                category_name,
                0,
            )
        ) + float(
            total or 0
        )

    return list(
        data.values()
    )


# =========================================================
# 3. MONTH VS LAST MONTH
# =========================================================

@router.get("/month-comparison")
def get_month_comparison(
    year: int = Query(...),
    month: int = Query(
        ...,
        ge=1,
        le=12,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_premium_user
    ),
):
    current_start = date(
        year,
        month,
        1,
    )

    if month == 12:

        next_month = date(
            year + 1,
            1,
            1,
        )

    else:

        next_month = date(
            year,
            month + 1,
            1,
        )

    if month == 1:

        previous_start = date(
            year - 1,
            12,
            1,
        )

    else:

        previous_start = date(
            year,
            month - 1,
            1,
        )

    # -----------------------------------------------------
    # CURRENT INCOME
    # -----------------------------------------------------

    current_income = (
        db.query(
            func.coalesce(
                func.sum(
                    Income.amount
                ),
                0,
            )
        )
        .filter(
            Income.user_id ==
            current_user.id,

            Income.date >=
            current_start,

            Income.date <
            next_month,
        )
        .scalar()
    )

    # -----------------------------------------------------
    # CURRENT EXPENSES
    # -----------------------------------------------------

    current_expenses = (
        db.query(
            func.coalesce(
                func.sum(
                    Expense.amount
                ),
                0,
            )
        )
        .filter(
            Expense.user_id ==
            current_user.id,

            Expense.date >=
            current_start,

            Expense.date <
            next_month,
        )
        .scalar()
    )

    # -----------------------------------------------------
    # PREVIOUS INCOME
    # -----------------------------------------------------

    previous_income = (
        db.query(
            func.coalesce(
                func.sum(
                    Income.amount
                ),
                0,
            )
        )
        .filter(
            Income.user_id ==
            current_user.id,

            Income.date >=
            previous_start,

            Income.date <
            current_start,
        )
        .scalar()
    )

    # -----------------------------------------------------
    # PREVIOUS EXPENSES
    # -----------------------------------------------------

    previous_expenses = (
        db.query(
            func.coalesce(
                func.sum(
                    Expense.amount
                ),
                0,
            )
        )
        .filter(
            Expense.user_id ==
            current_user.id,

            Expense.date >=
            previous_start,

            Expense.date <
            current_start,
        )
        .scalar()
    )

    current_income = float(
        current_income or 0
    )

    current_expenses = float(
        current_expenses or 0
    )

    previous_income = float(
        previous_income or 0
    )

    previous_expenses = float(
        previous_expenses or 0
    )

    current_balance = (
        current_income -
        current_expenses
    )

    previous_balance = (
        previous_income -
        previous_expenses
    )

    def percentage_change(
        current,
        previous,
    ):
        if previous == 0:

            if current > 0:
                return 100.0

            return 0.0

        return round(
            (
                (
                    current -
                    previous
                )
                /
                previous
            ) * 100,
            2,
        )

    return {
        "current_month": {
            "year": year,
            "month": month,
            "income": current_income,
            "expenses": current_expenses,
            "balance": current_balance,
        },

        "previous_month": {
            "year": previous_start.year,
            "month": previous_start.month,
            "income": previous_income,
            "expenses": previous_expenses,
            "balance": previous_balance,
        },

        "changes": {
            "income_percentage":
                percentage_change(
                    current_income,
                    previous_income,
                ),

            "expense_percentage":
                percentage_change(
                    current_expenses,
                    previous_expenses,
                ),

            "balance_percentage":
                percentage_change(
                    current_balance,
                    previous_balance,
                ),
        },
    }