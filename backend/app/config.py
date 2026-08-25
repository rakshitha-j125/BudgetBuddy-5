import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    # =========================
    # DATABASE
    # =========================

    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "sqlite:///./budgetbuddy.db"
    )

    # =========================
    # JWT
    # =========================

    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "change-this-secret-key"
    )

    ALGORITHM = os.getenv(
        "ALGORITHM",
        "HS256"
    )

    ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.getenv(
            "ACCESS_TOKEN_EXPIRE_MINUTES",
            "60"
        )
    )

    # =========================
    # OTP
    # =========================

    OTP_LENGTH = int(
        os.getenv(
            "OTP_LENGTH",
            "6"
        )
    )

    OTP_EXPIRE_MINUTES = int(
        os.getenv(
            "OTP_EXPIRE_MINUTES",
            "10"
        )
    )

    OTP_RESEND_INTERVAL = int(
        os.getenv(
            "OTP_RESEND_INTERVAL",
            "60"
        )
    )

    # =========================
    # PASSWORD RESET
    # =========================

    RESET_TOKEN_EXPIRE_MINUTES = int(
        os.getenv(
            "RESET_TOKEN_EXPIRE_MINUTES",
            "15"
        )
    )

    # =========================
    # EMAIL / SMTP
    # =========================

    SMTP_HOST = os.getenv(
        "SMTP_HOST",
        ""
    )

    SMTP_PORT = int(
        os.getenv(
            "SMTP_PORT",
            "587"
        )
    )

    SMTP_EMAIL = os.getenv(
        "SMTP_EMAIL",
        ""
    )

    SMTP_PASSWORD = os.getenv(
        "SMTP_PASSWORD",
        ""
    )

    SMTP_FROM = os.getenv(
        "SMTP_FROM",
        ""
    )

    SMTP_NAME = os.getenv(
        "SMTP_NAME",
        "BudgetBuddy"
    )


settings = Settings()


# Keep these exports because the existing project imports
# DATABASE_URL directly in app.database and other files.

DATABASE_URL = settings.DATABASE_URL
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

OTP_LENGTH = settings.OTP_LENGTH
OTP_EXPIRE_MINUTES = settings.OTP_EXPIRE_MINUTES
OTP_RESEND_INTERVAL = settings.OTP_RESEND_INTERVAL
RESET_TOKEN_EXPIRE_MINUTES = settings.RESET_TOKEN_EXPIRE_MINUTES