from datetime import datetime

from sqlalchemy.orm import Session

from app.models.premium_request import PremiumRequest


def get_pending_request_for_user(
    db: Session,
    user_id: int
):
    return (
        db.query(PremiumRequest)
        .filter(
            PremiumRequest.user_id == user_id,
            PremiumRequest.status == "pending"
        )
        .first()
    )


def get_latest_request_for_user(
    db: Session,
    user_id: int
):
    return (
        db.query(PremiumRequest)
        .filter(PremiumRequest.user_id == user_id)
        .order_by(PremiumRequest.requested_at.desc())
        .first()
    )


def create_premium_request(
    db: Session,
    user_id: int
):
    request = PremiumRequest(
        user_id=user_id,
        status="pending"
    )

    db.add(request)
    db.commit()
    db.refresh(request)

    return request


def get_all_premium_requests(
    db: Session
):
    return (
        db.query(PremiumRequest)
        .order_by(PremiumRequest.requested_at.desc())
        .all()
    )


def approve_premium_request(
    db: Session,
    request: PremiumRequest,
    user
):
    request.status = "approved"
    request.reviewed_at = datetime.utcnow()

    user.role = "premium"

    db.commit()
    db.refresh(request)

    return request


def reject_premium_request(
    db: Session,
    request: PremiumRequest
):
    request.status = "rejected"
    request.reviewed_at = datetime.utcnow()

    db.commit()
    db.refresh(request)

    return request
def withdraw_premium_request(db: Session, request: PremiumRequest, user):
    request.status = "withdrawn"
    request.reviewed_at = datetime.utcnow()

    # Remove Premium access
    if user.role == "premium":
        user.role = "student"

    db.commit()
    db.refresh(request)

    return request