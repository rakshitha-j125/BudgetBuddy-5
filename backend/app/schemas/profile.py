from typing import Optional

from pydantic import BaseModel


class ProfileBase(BaseModel):
    full_name: Optional[str] = None
    monthly_income: Optional[float] = 0.0
    currency: Optional[str] = "INR"


class ProfileUpdate(ProfileBase):
    pass


class ProfileOut(ProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True