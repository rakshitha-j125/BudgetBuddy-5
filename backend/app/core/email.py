import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.config import settings


def send_email(
    receiver: str,
    subject: str,
    body: str,
    html: bool = False,
):
    """
    Generic Email Sender
    """

    message = MIMEMultipart()

    message["From"] = (
        f"{settings.SMTP_NAME} <{settings.SMTP_FROM}>"
    )
    message["To"] = receiver
    message["Subject"] = subject

    message.attach(
        MIMEText(
            body,
            "html" if html else "plain",
        )
    )

    try:
        server = smtplib.SMTP(
            settings.SMTP_HOST,
            settings.SMTP_PORT,
        )

        server.starttls()

        server.login(
            settings.SMTP_EMAIL,
            settings.SMTP_PASSWORD,
        )

        server.sendmail(
            settings.SMTP_FROM,
            receiver,
            message.as_string(),
        )

        server.quit()

        return True

    except Exception as e:
        print(f"Email Error: {e}")
        return False


# ==========================================
# OTP Email
# ==========================================

def send_otp_email(
    receiver: str,
    otp: str,
):
    subject = "BudgetBuddy - Email Verification OTP"

    body = f"""
    <html>
        <body style="font-family:Arial,sans-serif;">
            <h2>BudgetBuddy</h2>

            <p>Your verification code is:</p>

            <h1 style="color:#2563eb;">
                {otp}
            </h1>

            <p>
                This OTP is valid for
                {settings.OTP_EXPIRE_MINUTES} minutes.
            </p>

            <p>
                Do not share this code with anyone.
            </p>
        </body>
    </html>
    """

    return send_email(
        receiver,
        subject,
        body,
        html=True,
    )


# ==========================================
# Password Reset Email
# ==========================================

def send_reset_password_email(
    receiver: str,
    reset_link: str,
):
    subject = "BudgetBuddy - Reset Password"

    body = f"""
    <html>
        <body style="font-family:Arial,sans-serif;">
            <h2>Reset Password</h2>

            <p>
                Click the button below to reset your password.
            </p>

            <p>
                <a
                    href="{reset_link}"
                    style="
                        background:#2563eb;
                        color:white;
                        padding:12px 20px;
                        text-decoration:none;
                        border-radius:6px;
                    "
                >
                    Reset Password
                </a>
            </p>

            <p>
                This link expires in
                {settings.RESET_TOKEN_EXPIRE_MINUTES}
                minutes.
            </p>
        </body>
    </html>
    """

    return send_email(
        receiver,
        subject,
        body,
        html=True,
    )


# ==========================================
# Welcome Email
# ==========================================

def send_welcome_email(
    receiver: str,
    full_name: str,
):
    subject = "Welcome to BudgetBuddy"

    body = f"""
    <html>
        <body style="font-family:Arial,sans-serif;">
            <h2>
                Welcome {full_name}
            </h2>

            <p>
                Your BudgetBuddy account has been created successfully.
            </p>

            <p>
                Start tracking your income,
                expenses and savings today.
            </p>

            <br>

            <b>
                Team BudgetBuddy
            </b>
        </body>
    </html>
    """

    return send_email(
        receiver,
        subject,
        body,
        html=True,
    )