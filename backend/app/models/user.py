from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    hashed_password = Column(
        String,
        nullable=False
    )

    role = Column(
        String,
        default="student",
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    otp = Column(
        String,
        nullable=True
    )

    otp_expiry = Column(
        DateTime,
        nullable=True
    )

    otp_resend_available_at = Column(
        DateTime,
        nullable=True
    )

    otp_verified = Column(
        Boolean,
        default=False,
        nullable=False
    )

    profile = relationship(
        "Profile",
        back_populates="owner",
        uselist=False,
        cascade="all, delete-orphan"
    )

    expenses = relationship(
        "Expense",
        back_populates="owner",
        cascade="all, delete-orphan"
    )

    incomes = relationship(
        "Income",
        back_populates="owner",
        cascade="all, delete-orphan"
    )

    budgets = relationship(
        "Budget",
        back_populates="owner",
        cascade="all, delete-orphan"
    )

    savings_goals = relationship(
        "SavingsGoal",
        back_populates="owner",
        cascade="all, delete-orphan"
    )

    notifications = relationship(
        "Notification",
        back_populates="owner",
        cascade="all, delete-orphan"
    )

    otps = relationship(
        "OTP",
        back_populates="owner",
        cascade="all, delete-orphan"
    )

    bank_accounts = relationship(
        "BankAccount",
        back_populates="user",
        cascade="all, delete-orphan"
    )