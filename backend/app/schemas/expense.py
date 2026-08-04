from datetime import datetime

from pydantic import BaseModel


class ExpenseCreate(BaseModel):
    category: str
    amount: float
    description: str = ""


class ExpenseUpdate(BaseModel):
    category: str
    amount: float
    description: str = ""


class ExpenseOut(BaseModel):
    id: int
    category: str
    amount: float
    description: str
    date: datetime

    class Config:
        from_attributes = True