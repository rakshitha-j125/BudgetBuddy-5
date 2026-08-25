from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.profile import Profile
from app.models.user import User


def get_user_by_email(
    db: Session,
    email: str
):
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


def get_user_by_id(
    db: Session,
    user_id: int
):
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


def create_user(
    db: Session,
    email: str,
    password: str,
    full_name: str
):
    user = User(
        email=email,
        hashed_password=hash_password(password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    profile = Profile(
        user_id=user.id,
        full_name=full_name
    )

    db.add(profile)
    db.commit()
    db.refresh(user)

    return user


def save_otp(
    db: Session,
    user: User,
    otp: str,
    otp_expiry,
    resend_available_at
):
    user.otp = otp
    user.otp_expiry = otp_expiry
    user.otp_resend_available_at = resend_available_at
    user.otp_verified = False

    db.commit()
    db.refresh(user)

    return user


def verify_user_otp(
    db: Session,
    user: User
):
    user.otp_verified = True

    db.commit()
    db.refresh(user)

    return user


def clear_otp(
    db: Session,
    user: User
):
    user.otp = None
    user.otp_expiry = None
    user.otp_resend_available_at = None

    db.commit()
    db.refresh(user)

    return user


def update_password(
    db: Session,
    user: User,
    password: str
):
    user.hashed_password = hash_password(password)
    user.otp = None
    user.otp_expiry = None
    user.otp_resend_available_at = None
    user.otp_verified = False

    db.commit()
    db.refresh(user)

    return user