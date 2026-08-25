from pydantic import BaseModel, EmailStr, Field


# =========================
# LOGIN
# =========================

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict


# =========================
# FORGOT PASSWORD
# =========================

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


# =========================
# VERIFY OTP
# =========================

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(
        ...,
        min_length=6,
        max_length=6
    )


# =========================
# RESET PASSWORD
# =========================

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str = Field(
        ...,
        min_length=6,
        max_length=6
    )
    password: str = Field(
        ...,
        min_length=6
    )