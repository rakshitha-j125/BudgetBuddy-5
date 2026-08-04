import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # ==========================================
    # Database
    # ==========================================
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "sqlite:///./budgetbuddy.db"
    )

    # ==========================================
    # JWT
    # ==========================================
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
            60
        )
    )

    # ==========================================
    # Gmail SMTP
    # ==========================================
    SMTP_HOST = os.getenv(
        "SMTP_HOST",
        "smtp.gmail.com"
    )

    SMTP_PORT = int(
        os.getenv(
            "SMTP_PORT",
            587
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

    # ==========================================
    # OTP
    # ==========================================
    OTP_LENGTH = int(
        os.getenv(
            "OTP_LENGTH",
            6
        )
    )

    OTP_EXPIRE_MINUTES = int(
        os.getenv(
            "OTP_EXPIRE_MINUTES",
            10
        )
    )

    OTP_RESEND_INTERVAL = int(
        os.getenv(
            "OTP_RESEND_INTERVAL",
            60
        )
    )

    # ==========================================
    # Password Reset
    # ==========================================
    RESET_TOKEN_EXPIRE_MINUTES = int(
        os.getenv(
            "RESET_TOKEN_EXPIRE_MINUTES",
            15
        )
    )

    # ==========================================
    # Frontend
    # ==========================================
    FRONTEND_URL = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173"
    )


settings = Settings()