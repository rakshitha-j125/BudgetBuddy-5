from datetime import datetime

from pydantic import BaseModel, Field


class IncomeBase(BaseModel):
    source: str
    amount: float = Field(gt=0)
    description: str = ""


class IncomeCreate(IncomeBase):
    pass


class IncomeUpdate(IncomeBase):
    pass


class IncomeOut(IncomeBase):
    id: int
    user_id: int
    date: datetime

    class Config:
        from_attributes = True