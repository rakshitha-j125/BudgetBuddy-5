from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PremiumRequestOut(BaseModel):
    id: int
    user_id: int
    status: str
    requested_at: datetime
    reviewed_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class PremiumRequestAdminOut(PremiumRequestOut):
    user_email: str