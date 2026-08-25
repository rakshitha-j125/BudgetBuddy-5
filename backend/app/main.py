from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.models import (
    User,
    Profile,
    Expense,
    Income,
    Budget,
    Notification,
    SavingsGoal,
    OTP,
    BankAccount,
)

from app.routers import (
    auth,
    expense,
    income,
    budget,
    profile,
    savings_goals,
    notification,
    analytics,
    reports,
    bank_accounts,
)


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="BudgetBuddy API",
    description="Personal finance management API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"],
)

app.include_router(
    expense.router,
    prefix="/expenses",
    tags=["Expenses"],
)

app.include_router(
    income.router,
    prefix="/incomes",
    tags=["Income"],
)

app.include_router(
    budget.router,
    prefix="/budgets",
    tags=["Budgets"],
)

app.include_router(
    profile.router,
    prefix="/profile",
    tags=["Profile"],
)

app.include_router(
    savings_goals.router,
    prefix="/savings-goals",
    tags=["Savings Goals"],
)

app.include_router(
    notification.router,
    prefix="/notifications",
    tags=["Notifications"],
)

app.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["Analytics"],
)

app.include_router(
    reports.router,
    prefix="/reports",
    tags=["Reports"],
)

app.include_router(
    bank_accounts.router,
    prefix="/bank-accounts",
    tags=["Bank Accounts"],
)


@app.get("/")
def root():
    return {
        "message": "BudgetBuddy API running",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }