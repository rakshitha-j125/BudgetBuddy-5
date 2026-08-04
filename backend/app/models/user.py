from datetime import datetime

from sqlalchemy import Boolean
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Integer
from sqlalchemy import String

from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False,
    )

    hashed_password = Column(
        String,
        nullable=False,
    )

    role = Column(
        String,
        default="student",
    )

    is_active = Column(
        Boolean,
        default=True,
    )

    is_verified = Column(
        Boolean,
        default=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    profile = relationship(
        "Profile",
        back_populates="owner",
        uselist=False,
        cascade="all, delete",
    )

    incomes = relationship(
        "Income",
        back_populates="owner",
        cascade="all, delete",
    )

    expenses = relationship(
        "Expense",
        back_populates="owner",
        cascade="all, delete",
    )

    budgets = relationship(
        "Budget",
        back_populates="owner",
        cascade="all, delete",
    )

    otps = relationship(
        "OTP",
        back_populates="owner",
        cascade="all, delete",
    )