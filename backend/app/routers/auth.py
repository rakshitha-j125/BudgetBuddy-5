from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.core.security import create_access_token, verify_password
from app.core.email import send_otp_email
from app.utils.otp import (
    generate_otp,
    get_otp_expiry,
    get_resend_expiry,
    validate_otp,
)
from app.crud.user import (
    create_user,
    get_user_by_email,
    save_otp,
    update_password,
    verify_user_otp,
)
from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyOTPRequest,
)
from app.schemas.user import Token, UserCreate, UserOut

router = APIRouter()


@router.post(
    "/signup",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED
)
def signup(
    user_in: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = get_user_by_email(
        db,
        user_in.email
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    if len(user_in.password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 6 characters"
        )

    user = create_user(
        db,
        user_in.email,
        user_in.password,
        user_in.full_name
    )

    return user


@router.post(
    "/login",
    response_model=Token
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = get_user_by_email(
        db,
        form_data.username
    )

    if (
        not user
        or not verify_password(
            form_data.password,
            user.hashed_password
        )
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    if not user.is_active:
        raise HTTPException(
            status_code=400,
            detail="Inactive user"
        )

    token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get(
    "/me",
    response_model=UserOut
)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    user = get_user_by_email(
        db,
        request.email
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Email not registered"
        )

    otp = generate_otp()
    otp_expiry = get_otp_expiry()
    resend_available_at = get_resend_expiry()

    save_otp(
        db,
        user,
        otp,
        otp_expiry,
        resend_available_at
    )

    print(f"[DEBUG] OTP generated for {user.email}: {otp}")

    email_sent = send_otp_email(
        user.email,
        otp
    )

    if not email_sent:
        raise HTTPException(
            status_code=500,
            detail="Unable to send OTP email"
        )

    return {
        "message": "OTP has been sent to your email"
    }


@router.post("/verify-otp")
def verify_otp(
    request: VerifyOTPRequest,
    db: Session = Depends(get_db)
):
    user = get_user_by_email(
        db,
        request.email
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Email not registered"
        )

    if not validate_otp(
        user.otp,
        request.otp,
        user.otp_expiry
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired OTP"
        )

    verify_user_otp(
        db,
        user
    )

    return {
        "message": "OTP verified successfully"
    }


@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    user = get_user_by_email(
        db,
        request.email
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Email not registered"
        )

    if not validate_otp(
        user.otp,
        request.otp,
        user.otp_expiry
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired OTP"
        )

    if len(request.password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 6 characters"
        )

    update_password(
        db,
        user,
        request.password
    )

    return {
        "message": "Password reset successfully"
    }