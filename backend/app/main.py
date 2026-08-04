from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base
from app.database import engine
from app.routers import profile

from app.routers import (
    auth,
    income,
    expense,
    budget,
    analytics,
    reports,
)

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BudgetBuddy API",
    version="1.0.0",
    description="Personal Finance Management Backend",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root Route
@app.get("/")
def root():
    return {
        "message": "Welcome to BudgetBuddy API 🚀"
    }

# Routers
app.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"],
)

app.include_router(
    income.router,
    prefix="/income",
    tags=["Income"],
)

app.include_router(
    expense.router,
    prefix="/expense",
    tags=["Expense"],
)

app.include_router(
    budget.router,
    prefix="/budget",
    tags=["Budget"],
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
    profile.router,
    prefix="/profile",
    tags=["Profile"],
)