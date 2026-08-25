from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from app.database import Base


class Income(Base):
    __tablename__ = "incomes"

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

    bank_account_id = Column(
        Integer,
        ForeignKey("bank_accounts.id"),
        nullable=False,
        index=True
    )

    source = Column(
        String,
        nullable=False
    )

    amount = Column(
        Float,
        nullable=False
    )

    date = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    notes = Column(
        String,
        nullable=True
    )

    owner = relationship(
        "User",
        back_populates="incomes"
    )

    bank_account = relationship(
        "BankAccount",
        back_populates="incomes"
    )