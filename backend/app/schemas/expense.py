from datetime import datetime

from pydantic import BaseModel, Field


EXPENSE_CATEGORIES = [
    "Food",
    "Travel",
    "Shopping",
    "Education",
    "Entertainment",
    "Miscellaneous",
]


class ExpenseBase(BaseModel):
    category: str = Field(
        ...,
        min_length=1,
        max_length=50
    )

    amount: float = Field(
        ...,
        gt=0
    )

    description: str | None = Field(
        default=None,
        max_length=500
    )

    date: datetime | None = None


class ExpenseCreate(ExpenseBase):
    bank_account_id: int = Field(
        ...,
        gt=0
    )


class ExpenseUpdate(BaseModel):
    bank_account_id: int | None = Field(
        default=None,
        gt=0
    )

    category: str | None = Field(
        default=None,
        min_length=1,
        max_length=50
    )

    amount: float | None = Field(
        default=None,
        gt=0
    )

    description: str | None = Field(
        default=None,
        max_length=500
    )

    date: datetime | None = None


class ExpenseOut(ExpenseBase):
    id: int
    date: datetime
    user_id: int
    bank_account_id: int

    class Config:
        from_attributes = True


class CategorySummary(BaseModel):
    category: str
    total: float