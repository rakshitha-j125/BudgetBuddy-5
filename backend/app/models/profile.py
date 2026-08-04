from sqlalchemy import Column
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String

from sqlalchemy.orm import relationship

from app.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
    )

    full_name = Column(String)

    monthly_income = Column(
        Float,
        default=0.0,
    )

    currency = Column(
        String,
        default="INR",
    )

    owner = relationship(
        "User",
        back_populates="profile",
    )