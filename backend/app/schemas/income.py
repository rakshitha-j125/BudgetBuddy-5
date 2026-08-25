from datetime import datetime

from pydantic import BaseModel, Field


class IncomeBase(BaseModel):
    source: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    amount: float = Field(
        ...,
        gt=0
    )

    date: datetime | None = None

    notes: str | None = Field(
        default=None,
        max_length=500
    )


class IncomeCreate(IncomeBase):
    bank_account_id: int = Field(
        ...,
        gt=0
    )


class IncomeUpdate(BaseModel):
    bank_account_id: int | None = Field(
        default=None,
        gt=0
    )

    source: str | None = Field(
        default=None,
        min_length=1,
        max_length=100
    )

    amount: float | None = Field(
        default=None,
        gt=0
    )

    date: datetime | None = None

    notes: str | None = Field(
        default=None,
        max_length=500
    )


class IncomeOut(IncomeBase):
    id: int
    date: datetime
    user_id: int
    bank_account_id: int

    class Config:
        from_attributes = True