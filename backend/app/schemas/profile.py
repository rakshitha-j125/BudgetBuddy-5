from typing import Optional

from pydantic import BaseModel, Field


class ProfileBase(BaseModel):
    full_name: Optional[str] = None
    monthly_income: Optional[float] = Field(
        default=0.0,
        ge=0,
    )
    currency: Optional[str] = "INR"
    financial_goal: Optional[str] = None


class ProfileUpdate(ProfileBase):
    pass


class ProfileOut(ProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True