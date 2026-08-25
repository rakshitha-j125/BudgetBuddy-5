from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class ProfileOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    monthly_income: float
    currency: str

    class Config:
        from_attributes = True


class UserWithProfile(UserOut):
    profile: ProfileOut | None = None