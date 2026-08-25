from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class SavingsGoalBase(BaseModel):
    name: str
    target_amount: Decimal
    deadline: datetime | None = None


class SavingsGoalCreate(SavingsGoalBase):
    pass


class SavingsGoalUpdate(BaseModel):
    name: str | None = None
    target_amount: Decimal | None = None
    deadline: datetime | None = None


class SavingsGoalOut(SavingsGoalBase):
    id: int
    user_id: int
    current_amount: Decimal
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SavingsContribution(BaseModel):
    amount: Decimal
    bank_account_id: int