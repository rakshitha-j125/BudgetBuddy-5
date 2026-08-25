from pydantic import BaseModel, Field


class BankAccountBase(BaseModel):
    bank_name: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    account_name: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    account_type: str = Field(
        ...,
        min_length=1,
        max_length=50
    )

    account_number_last4: str = Field(
        ...,
        min_length=4,
        max_length=4
    )

    balance: float = Field(
        default=0,
        ge=0
    )

    currency: str = Field(
        default="INR",
        min_length=1,
        max_length=10
    )

    is_active: bool = True


class BankAccountCreate(BankAccountBase):
    pass


class BankAccountUpdate(BaseModel):
    bank_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100
    )

    account_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100
    )

    account_type: str | None = Field(
        default=None,
        min_length=1,
        max_length=50
    )

    account_number_last4: str | None = Field(
        default=None,
        min_length=4,
        max_length=4
    )

    balance: float | None = Field(
        default=None,
        ge=0
    )

    currency: str | None = Field(
        default=None,
        min_length=1,
        max_length=10
    )

    is_active: bool | None = None


class BankAccountOut(BankAccountBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True