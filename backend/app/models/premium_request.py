from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class PremiumRequest(Base):
    __tablename__ = "premium_requests"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    status = Column(
        String(20),
        default="pending",
        nullable=False
    )

    requested_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    reviewed_at = Column(
        DateTime,
        nullable=True
    )

    user = relationship(
        "User",
        back_populates="premium_requests"
    )