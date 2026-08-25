from pydantic import BaseModel, Field


class BudgetBase(BaseModel):
    category: str = Field(
        ...,
        min_length=1,
        max_length=50
    )

    monthly_limit: float = Field(
        ...,
        gt=0
    )

    month_year: str = Field(
        ...,
        pattern=r"^\d{4}-(0[1-9]|1[0-2])$"
    )


class BudgetCreate(BudgetBase):
    pass


class BudgetUpdate(BaseModel):
    category: str | None = Field(
        default=None,
        min_length=1,
        max_length=50
    )

    monthly_limit: float | None = Field(
        default=None,
        gt=0
    )

    month_year: str | None = Field(
        default=None,
        pattern=r"^\d{4}-(0[1-9]|1[0-2])$"
    )


class BudgetOut(BudgetBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True