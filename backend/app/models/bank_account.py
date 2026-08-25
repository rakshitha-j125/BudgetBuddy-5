from sqlalchemy import Column, Integer, String, Numeric, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class BankAccount(Base):
    __tablename__ = "bank_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    bank_name = Column(String(100), nullable=False)
    account_name = Column(String(100), nullable=False)
    account_type = Column(String(50), nullable=False)
    account_number_last4 = Column(String(4), nullable=False)
    balance = Column(Numeric(12, 2), nullable=False, default=0)
    currency = Column(String(10), nullable=False, default="INR")
    is_active = Column(Boolean, nullable=False, default=True)

    user = relationship("User", back_populates="bank_accounts")

    expenses = relationship(
        "Expense",
        back_populates="bank_account",
    )

    incomes = relationship(
        "Income",
        back_populates="bank_account",
    )