from sqlalchemy.orm import Session

from app.models.user import User
from app.models.profile import Profile

from app.core.security import hash_password
from datetime import datetime

from app.models.otp import OTP

def get_user_by_email(
    db: Session,
    email: str,
):
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


def get_user_by_id(
    db: Session,
    user_id: int,
):
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


def create_user(
    db: Session,
    full_name: str,
    email: str,
    password: str,
):
    user = User(
        email=email,
        hashed_password=hash_password(password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    profile = Profile(
        user_id=user.id,
        full_name=full_name,
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return user


def verify_user(
    db: Session,
    user: User,
):
    user.is_verified = True

    db.commit()
    db.refresh(user)

    return user


def activate_user(
    db: Session,
    user: User,
):
    user.is_verified = True

    db.commit()
    db.refresh(user)

    return user


def update_password(
    db: Session,
    user: User,
    password: str,
):
    user.hashed_password = hash_password(password)

    db.commit()
    db.refresh(user)

    return user


def update_profile(
    db: Session,
    user: User,
    full_name: str = None,
    monthly_income: float = None,
    currency: str = None,
):
    profile = user.profile

    if full_name is not None:
        profile.full_name = full_name

    if monthly_income is not None:
        profile.monthly_income = monthly_income

    if currency is not None:
        profile.currency = currency

    db.commit()
    db.refresh(profile)

    return profile


def delete_user(
    db: Session,
    user: User,
):
    db.delete(user)
    db.commit()
def create_otp(
    db: Session,
    user_id: int,
    otp: str,
    purpose: str,
    expires_at: datetime,
):
    """
    Create a new OTP.
    """

    db.query(OTP).filter(
        OTP.user_id == user_id,
        OTP.purpose == purpose,
        OTP.is_used == False,
    ).delete()

    otp_record = OTP(
        user_id=user_id,
        otp=otp,
        purpose=purpose,
        expires_at=expires_at,
    )

    db.add(otp_record)
    db.commit()
    db.refresh(otp_record)

    return otp_record


def get_latest_otp(
    db: Session,
    user_id: int,
    purpose: str,
):
    """
    Get the latest unused OTP.
    """

    return (
        db.query(OTP)
        .filter(
            OTP.user_id == user_id,
            OTP.purpose == purpose,
            OTP.is_used == False,
        )
        .order_by(
            OTP.created_at.desc()
        )
        .first()
    )


def mark_otp_used(
    db: Session,
    otp_record: OTP,
):
    """
    Mark OTP as used.
    """

    otp_record.is_used = True

    db.commit()
    db.refresh(otp_record)

    return otp_record


def delete_expired_otps(
    db: Session,
):
    """
    Delete expired OTPs.
    """

    (
        db.query(OTP)
        .filter(
            OTP.expires_at < datetime.utcnow()
        )
        .delete()
    )

    db.commit()


def delete_user_otps(
    db: Session,
    user_id: int,
):
    """
    Delete all OTPs for a user.
    """

    (
        db.query(OTP)
        .filter(
            OTP.user_id == user_id
        )
        .delete()
    )

    db.commit()