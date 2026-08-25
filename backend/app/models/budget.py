from sqlalchemy import (
    Column,
    Float,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from app.database import Base


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    category = Column(
        String,
        nullable=False
    )

    monthly_limit = Column(
        Float,
        nullable=False
    )

    month_year = Column(
        String,
        nullable=False
    )

    owner = relationship(
        "User",
        back_populates="budgets"
    )