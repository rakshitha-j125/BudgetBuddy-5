import random
from datetime import datetime, timedelta

from app.config import settings


def generate_otp() -> str:
    """
    Generate a numeric OTP.
    Default length comes from config.
    """

    minimum = 10 ** (settings.OTP_LENGTH - 1)
    maximum = (10 ** settings.OTP_LENGTH) - 1

    return str(
        random.randint(
            minimum,
            maximum,
        )
    )


def get_otp_expiry() -> datetime:
    """
    Returns OTP expiry time.
    """

    return datetime.utcnow() + timedelta(
        minutes=settings.OTP_EXPIRE_MINUTES
    )


def is_otp_expired(
    expiry_time: datetime,
) -> bool:
    """
    Check whether OTP has expired.
    """

    if expiry_time is None:
        return True

    return datetime.utcnow() > expiry_time


def validate_otp(
    saved_otp: str,
    entered_otp: str,
    expiry_time: datetime,
) -> bool:
    """
    Validate OTP and expiry.
    """

    if saved_otp is None:
        return False

    if entered_otp is None:
        return False

    if is_otp_expired(expiry_time):
        return False

    return (
        saved_otp.strip() == entered_otp.strip()
    )


def get_resend_expiry() -> datetime:
    """
    Returns next allowed resend time.
    """

    return datetime.utcnow() + timedelta(
        seconds=settings.OTP_RESEND_INTERVAL
    )