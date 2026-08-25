from fastapi import APIRouter, Depends 
from sqlalchemy import extract, func 
from sqlalchemy.orm import Session 
 
from app.core.deps import get_current_user 
from app.database import get_db 
from app.models.expense import Expense 
from app.models.income import Income 
from app.models.savings_goal import SavingsGoal 
from app.models.user import User 
 
 
router = APIRouter() 
 
 
@router.get("/summary") 
def get_summary( 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user), 
): 
    total_income = ( 
        db.query( 
            func.coalesce(func.sum(Income.amount), 0) 
        ) 
        .filter(Income.user_id == current_user.id) 
        .scalar() 
    ) 
 
    total_expenses = ( 
        db.query( 
            func.coalesce(func.sum(Expense.amount), 0) 
        ) 
        .filter(Expense.user_id == current_user.id) 
        .scalar() 
    ) 
 
    total_income = float(total_income or 0) 
    total_expenses = float(total_expenses or 0) 
 
    return { 
        "total_income": total_income, 
        "total_expenses": total_expenses, 
        "balance": total_income - total_expenses, 
    } 
 
 
@router.get("/expenses") 
def get_expense_analytics( 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user), 
): 
    total = ( 
        db.query( 
            func.coalesce(func.sum(Expense.amount), 0) 
        ) 
        .filter(Expense.user_id == current_user.id) 
        .scalar() 
    ) 
 
    count = ( 
        db.query(func.count(Expense.id)) 
        .filter(Expense.user_id == current_user.id) 
        .scalar() 
    ) 
 
    average = ( 
        db.query( 
            func.coalesce(func.avg(Expense.amount), 0) 
        ) 
        .filter(Expense.user_id == current_user.id) 
        .scalar() 
    ) 
 
    return { 
        "total_expenses": float(total or 0), 
        "expense_count": int(count or 0), 
        "average_expense": float(average or 0), 
    } 
 
 
@router.get("/income") 
def get_income_analytics( 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user), 
): 
    total = ( 
        db.query( 
            func.coalesce(func.sum(Income.amount), 0) 
        ) 
        .filter(Income.user_id == current_user.id) 
        .scalar() 
    ) 
 
    count = ( 
        db.query(func.count(Income.id)) 
        .filter(Income.user_id == current_user.id) 
        .scalar() 
    ) 
 
    average = ( 
        db.query( 
            func.coalesce(func.avg(Income.amount), 0) 
        ) 
        .filter(Income.user_id == current_user.id) 
        .scalar() 
    ) 
 
    return { 
        "total_income": float(total or 0), 
        "income_count": int(count or 0), 
        "average_income": float(average or 0), 
    } 
 
 
@router.get("/categories") 
def get_category_analytics( 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user), 
): 
    results = ( 
        db.query( 
            Expense.category, 
            func.sum(Expense.amount).label("total"), 
        ) 
        .filter(Expense.user_id == current_user.id) 
        .group_by(Expense.category) 
        .order_by(func.sum(Expense.amount).desc()) 
        .all() 
    ) 
 
    return [ 
        { 
            "category": category, 
            "total": float(total or 0), 
        } 
        for category, total in results 
    ] 
 
 
@router.get("/monthly-trends") 
def get_monthly_trends( 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user), 
): 
    expenses = ( 
        db.query( 
            extract("year", Expense.date).label("year"), 
            extract("month", Expense.date).label("month"), 
            func.sum(Expense.amount).label("total"), 
        ) 
        .filter(Expense.user_id == current_user.id) 
        .group_by( 
            extract("year", Expense.date), 
            extract("month", Expense.date), 
        ) 
        .order_by( 
            extract("year", Expense.date), 
            extract("month", Expense.date), 
        ) 
        .all() 
    ) 
 
    incomes = ( 
        db.query( 
            extract("year", Income.date).label("year"), 
            extract("month", Income.date).label("month"), 
            func.sum(Income.amount).label("total"), 
        ) 
        .filter(Income.user_id == current_user.id) 
        .group_by( 
            extract("year", Income.date), 
            extract("month", Income.date), 
        ) 
        .order_by( 
            extract("year", Income.date), 
            extract("month", Income.date), 
        ) 
        .all() 
    ) 
 
    data = {} 
 
    for year, month, total in expenses: 
        key = f"{int(year)}-{int(month):02d}" 
 
        data.setdefault( 
            key, 
            { 
                "month": key, 
                "income": 0.0, 
                "expenses": 0.0, 
            }, 
        ) 
 
        data[key]["expenses"] = float(total or 0) 
 
    for year, month, total in incomes: 
        key = f"{int(year)}-{int(month):02d}" 
 
        data.setdefault( 
            key, 
            { 
                "month": key, 
                "income": 0.0, 
                "expenses": 0.0, 
            }, 
        ) 
 
        data[key]["income"] = float(total or 0) 
 
    return sorted( 
        data.values(), 
        key=lambda x: x["month"], 
    ) 
 
 
@router.get("/savings") 
def get_savings_analytics( 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user), 
): 
    goals = ( 
        db.query(SavingsGoal) 
        .filter(SavingsGoal.user_id == current_user.id) 
        .all() 
    ) 
 
    total_target = sum( 
        float(goal.target_amount or 0) 
        for goal in goals 
    ) 
 
    return { 
        "goal_count": len(goals), 
        "total_target": total_target, 
        "goals": [ 
            { 
                "id": goal.id, 
                "name": goal.name, 
                "target_amount": float( 
                    goal.target_amount or 0 
                ), 
                "deadline": goal.deadline, 
            } 
            for goal in goals 
        ], 
    }