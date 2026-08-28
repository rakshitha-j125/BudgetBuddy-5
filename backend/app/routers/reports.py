import csv
import io
from datetime import datetime

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database import get_db
from app.models.budget import Budget
from app.models.expense import Expense
from app.models.income import Income
from app.models.savings_goal import SavingsGoal
from app.models.user import User


router = APIRouter()


# ============================================================
# ALL REPORT DATA
# ============================================================

@router.get("/")
def get_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    incomes = (
        db.query(Income)
        .filter(Income.user_id == current_user.id)
        .order_by(Income.date.desc())
        .all()
    )

    expenses = (
        db.query(Expense)
        .filter(Expense.user_id == current_user.id)
        .order_by(Expense.date.desc())
        .all()
    )

    budgets = (
        db.query(Budget)
        .filter(Budget.user_id == current_user.id)
        .all()
    )

    savings_goals = (
        db.query(SavingsGoal)
        .filter(SavingsGoal.user_id == current_user.id)
        .all()
    )

    total_income = sum(
        float(income.amount or 0)
        for income in incomes
    )

    total_expenses = sum(
        float(expense.amount or 0)
        for expense in expenses
    )

    total_saved = sum(
        float(goal.current_amount or 0)
        for goal in savings_goals
    )

    total_target = sum(
        float(goal.target_amount or 0)
        for goal in savings_goals
    )

    return {
        "summary": {
            "total_income": total_income,
            "total_expenses": total_expenses,
            "balance": total_income - total_expenses,
            "total_saved": total_saved,
            "total_target": total_target,
        },

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

        "savings_goals": [
            {
                "id": goal.id,
                "name": goal.name,
                "target_amount": float(
                    goal.target_amount or 0
                ),
                "current_amount": float(
                    goal.current_amount or 0
                ),
                "progress": (
                    (
                        float(goal.current_amount or 0)
                        / float(goal.target_amount)
                    ) * 100
                    if float(goal.target_amount or 0) > 0
                    else 0
                ),
                "deadline": goal.deadline,
            }
            for goal in savings_goals
        ],
    }


# ============================================================
# MONTHLY REPORT
# ============================================================

@router.get("/monthly")
def get_monthly_report(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    incomes = (
        db.query(Income)
        .filter(
            Income.user_id == current_user.id,
            extract("year", Income.date) == year,
            extract("month", Income.date) == month,
        )
        .order_by(Income.date.asc())
        .all()
    )

    expenses = (
        db.query(Expense)
        .filter(
            Expense.user_id == current_user.id,
            extract("year", Expense.date) == year,
            extract("month", Expense.date) == month,
        )
        .order_by(Expense.date.asc())
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

    category_data = {}

    for expense in expenses:
        category = expense.category or "Other"

        category_data[category] = (
            category_data.get(category, 0)
            + float(expense.amount or 0)
        )

    category_breakdown = [
        {
            "category": category,
            "total": total,
        }
        for category, total in sorted(
            category_data.items(),
            key=lambda item: item[1],
            reverse=True,
        )
    ]

    return {
        "year": year,
        "month": month,
        "month_name": datetime(
            year,
            month,
            1
        ).strftime("%B %Y"),

        "summary": {
            "total_income": total_income,
            "total_expenses": total_expenses,
            "balance": total_income - total_expenses,
        },

        "income": [
            {
                "id": item.id,
                "amount": float(item.amount or 0),
                "source": item.source,
                "date": item.date,
            }
            for item in incomes
        ],

        "expenses": [
            {
                "id": item.id,
                "amount": float(item.amount or 0),
                "category": item.category,
                "description": item.description,
                "date": item.date,
            }
            for item in expenses
        ],

        "category_breakdown": category_breakdown,
    }


# ============================================================
# CSV EXPORT
# ============================================================

@router.get("/export")
def export_reports_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    incomes = (
        db.query(Income)
        .filter(Income.user_id == current_user.id)
        .order_by(Income.date.desc())
        .all()
    )

    expenses = (
        db.query(Expense)
        .filter(Expense.user_id == current_user.id)
        .order_by(Expense.date.desc())
        .all()
    )

    budgets = (
        db.query(Budget)
        .filter(Budget.user_id == current_user.id)
        .all()
    )

    output = io.StringIO()
    writer = csv.writer(output)

    # ========================================================
    # INCOME
    # ========================================================

    writer.writerow(["INCOME"])

    writer.writerow([
        "ID",
        "Amount",
        "Source",
    ])

    for income in incomes:
        writer.writerow([
            income.id,
            float(income.amount or 0),
            income.source or "",
        ])

    writer.writerow([])
    writer.writerow([])

    # ========================================================
    # EXPENSES
    # ========================================================

    writer.writerow(["EXPENSES"])

    writer.writerow([
        "ID",
        "Amount",
        "Category",
        "Description",
    ])

    for expense in expenses:
        writer.writerow([
            expense.id,
            float(expense.amount or 0),
            expense.category or "",
            expense.description or "",
        ])

    writer.writerow([])
    writer.writerow([])

    # ========================================================
    # BUDGETS
    # ========================================================

    writer.writerow(["BUDGETS"])

    writer.writerow([
        "ID",
        "Category",
        "Monthly Limit",
    ])

    for budget in budgets:
        writer.writerow([
            budget.id,
            budget.category or "",
            float(budget.monthly_limit or 0),
        ])

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

# ============================================================
# PDF EXPORT
# ============================================================

@router.get("/export/pdf")
def export_reports_pdf(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        from reportlab.lib import colors
        from reportlab.lib.enums import TA_CENTER
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import (
            getSampleStyleSheet,
            ParagraphStyle,
        )
        from reportlab.lib.units import mm
        from reportlab.platypus import (
            SimpleDocTemplate,
            Paragraph,
            Spacer,
            Table,
            TableStyle,
        )
    except ImportError:
        return StreamingResponse(
            iter(
                [
                    "ReportLab is not installed. "
                    "Run: pip install reportlab"
                ]
            ),
            media_type="text/plain",
            status_code=500,
        )

    incomes = (
        db.query(Income)
        .filter(Income.user_id == current_user.id)
        .order_by(Income.date.desc())
        .all()
    )

    expenses = (
        db.query(Expense)
        .filter(Expense.user_id == current_user.id)
        .order_by(Expense.date.desc())
        .all()
    )

    budgets = (
        db.query(Budget)
        .filter(Budget.user_id == current_user.id)
        .all()
    )

    savings_goals = (
        db.query(SavingsGoal)
        .filter(SavingsGoal.user_id == current_user.id)
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

    balance = total_income - total_expenses

    total_saved = sum(
        float(goal.current_amount or 0)
        for goal in savings_goals
    )

    total_target = sum(
        float(goal.target_amount or 0)
        for goal in savings_goals
    )

    buffer = io.BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=15 * mm,
        leftMargin=15 * mm,
        topMargin=15 * mm,
        bottomMargin=15 * mm,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "BudgetBuddyTitle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=22,
        spaceAfter=8,
    )

    heading_style = ParagraphStyle(
        "BudgetBuddyHeading",
        parent=styles["Heading2"],
        fontSize=14,
        spaceBefore=12,
        spaceAfter=8,
    )

    normal_style = ParagraphStyle(
        "BudgetBuddyNormal",
        parent=styles["Normal"],
        fontSize=9,
    )

    story = []

    story.append(
        Paragraph(
            "BudgetBuddy Financial Report",
            title_style,
        )
    )

    story.append(
        Paragraph(
            f"Prepared for {current_user.email}",
            normal_style,
        )
    )

    story.append(
        Paragraph(
            f"Generated on "
            f"{datetime.now().strftime('%d %B %Y, %I:%M %p')}",
            normal_style,
        )
    )

    story.append(Spacer(1, 10))

    # ========================================================
    # SUMMARY
    # ========================================================

    story.append(
        Paragraph(
            "Financial Summary",
            heading_style,
        )
    )

    summary_data = [
        ["Metric", "Amount"],
        ["Total Income", f"Rs. {total_income:,.2f}"],
        ["Total Expenses", f"Rs. {total_expenses:,.2f}"],
        ["Balance", f"Rs. {balance:,.2f}"],
        ["Total Saved", f"Rs. {total_saved:,.2f}"],
        ["Savings Target", f"Rs. {total_target:,.2f}"],
    ]

    summary_table = Table(
        summary_data,
        colWidths=[90 * mm, 80 * mm],
    )

    summary_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#4F46E5"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "FONTNAME",
                    (0, 1),
                    (0, -1),
                    "Helvetica-Bold",
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey,
                ),
                (
                    "PADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
            ]
        )
    )

    story.append(summary_table)

    # ========================================================
    # EXPENSES
    # ========================================================

    story.append(
        Paragraph(
            "Expense Details",
            heading_style,
        )
    )

    expense_rows = [
        [
            "Date",
            "Category",
            "Description",
            "Amount",
        ]
    ]

    for expense in expenses[:50]:
        expense_rows.append(
            [
                str(expense.date),
                expense.category or "Other",
                expense.description or "-",
                f"Rs. {float(expense.amount or 0):,.2f}",
            ]
        )

    if len(expense_rows) == 1:
        expense_rows.append(
            [
                "-",
                "No expenses",
                "-",
                "Rs. 0.00",
            ]
        )

    expense_table = Table(
        expense_rows,
        colWidths=[
            32 * mm,
            38 * mm,
            65 * mm,
            35 * mm,
        ],
        repeatRows=1,
    )

    expense_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#EF4444"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey,
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "PADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
            ]
        )
    )

    story.append(expense_table)

    # ========================================================
    # INCOME
    # ========================================================

    story.append(
        Paragraph(
            "Income Details",
            heading_style,
        )
    )

    income_rows = [
        [
            "Date",
            "Source",
            "Amount",
        ]
    ]

    for income in incomes[:50]:
        income_rows.append(
            [
                str(income.date),
                income.source or "Income",
                f"Rs. {float(income.amount or 0):,.2f}",
            ]
        )

    if len(income_rows) == 1:
        income_rows.append(
            [
                "-",
                "No income",
                "Rs. 0.00",
            ]
        )

    income_table = Table(
        income_rows,
        colWidths=[
            50 * mm,
            80 * mm,
            40 * mm,
        ],
        repeatRows=1,
    )

    income_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#10B981"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey,
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "PADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
            ]
        )
    )

    story.append(income_table)

    # ========================================================
    # BUDGETS
    # ========================================================

    story.append(
        Paragraph(
            "Budgets",
            heading_style,
        )
    )

    budget_rows = [
        [
            "Category",
            "Monthly Limit",
        ]
    ]

    for budget in budgets:
        budget_rows.append(
            [
                budget.category or "Other",
                f"Rs. {float(budget.monthly_limit or 0):,.2f}",
            ]
        )

    if len(budget_rows) == 1:
        budget_rows.append(
            [
                "No budgets",
                "Rs. 0.00",
            ]
        )

    budget_table = Table(
        budget_rows,
        colWidths=[
            100 * mm,
            70 * mm,
        ],
        repeatRows=1,
    )

    budget_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#F59E0B"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey,
                ),
                (
                    "PADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
            ]
        )
    )

    story.append(budget_table)

    # ========================================================
    # SAVINGS GOALS
    # ========================================================

    story.append(
        Paragraph(
            "Savings Goals",
            heading_style,
        )
    )

    savings_rows = [
        [
            "Goal",
            "Saved",
            "Target",
            "Progress",
        ]
    ]

    for goal in savings_goals:
        saved = float(goal.current_amount or 0)
        target = float(goal.target_amount or 0)

        progress = (
            (saved / target) * 100
            if target > 0
            else 0
        )

        savings_rows.append(
            [
                goal.name,
                f"Rs. {saved:,.2f}",
                f"Rs. {target:,.2f}",
                f"{min(progress, 100):.1f}%",
            ]
        )

    if len(savings_rows) == 1:
        savings_rows.append(
            [
                "No savings goals",
                "Rs. 0.00",
                "Rs. 0.00",
                "0%",
            ]
        )

    savings_table = Table(
        savings_rows,
        colWidths=[
            55 * mm,
            40 * mm,
            40 * mm,
            35 * mm,
        ],
        repeatRows=1,
    )

    savings_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#8B5CF6"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey,
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "PADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
            ]
        )
    )

    story.append(savings_table)

    # ========================================================
    # FOOTER
    # ========================================================

    story.append(Spacer(1, 15))

    story.append(
        Paragraph(
            "Generated by BudgetBuddy",
            ParagraphStyle(
                "Footer",
                parent=normal_style,
                alignment=TA_CENTER,
                textColor=colors.grey,
            ),
        )
    )

    document.build(story)

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                "attachment; "
                "filename=budgetbuddy_report.pdf"
            )
        },
    )