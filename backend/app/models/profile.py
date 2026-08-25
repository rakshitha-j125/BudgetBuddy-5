from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    full_name = Column(
        String,
        nullable=False
    )

    monthly_income = Column(
        Float,
        default=0.0
    )

    currency = Column(
        String,
        default="INR"
    )

    financial_goal = Column(
        String,
        nullable=True
    )

    owner = relationship(
        "User",
        back_populates="profile"
    )