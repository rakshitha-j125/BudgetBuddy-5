from datetime import datetime
from datetime import timedelta

from sqlalchemy.orm import Session

from app.config import settings
from app.models.otp import OTP


def create_otp(
    db: Session,
    user_id: int,
    otp: str,
    purpose: str,
):
    delete_expired_otps(db)

    otp_obj = OTP(
        user_id=user_id,
        otp=otp,
        purpose=purpose,
        expires_at=datetime.utcnow()
        + timedelta(
            minutes=settings.OTP_EXPIRE_MINUTES
        ),
    )

    db.add(otp_obj)
    db.commit()
    db.refresh(otp_obj)

    return otp_obj


def get_latest_otp(
    db: Session,
    user_id: int,
    purpose: str,
):
    return (
        db.query(OTP)
        .filter(
            OTP.user_id == user_id,
            OTP.purpose == purpose,
            OTP.is_used == False,
        )
        .order_by(OTP.created_at.desc())
        .first()
    )


def verify_otp(
    db: Session,
    user_id: int,
    otp: str,
    purpose: str,
):
    otp_obj = (
        db.query(OTP)
        .filter(
            OTP.user_id == user_id,
            OTP.otp == otp,
            OTP.purpose == purpose,
            OTP.is_used == False,
        )
        .first()
    )

    if not otp_obj:
        return None

    if otp_obj.expires_at < datetime.utcnow():
        return None

    otp_obj.is_used = True

    db.commit()

    db.refresh(otp_obj)

    return otp_obj


def delete_expired_otps(
    db: Session,
):
    db.query(OTP).filter(
        OTP.expires_at < datetime.utcnow()
    ).delete()

    db.commit()
    