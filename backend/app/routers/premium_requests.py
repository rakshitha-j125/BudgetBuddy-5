from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_admin_user
from app.crud.premium_request import (
    approve_premium_request,
    create_premium_request,
    get_all_premium_requests,
    get_latest_request_for_user,
    get_pending_request_for_user,
    reject_premium_request,
    withdraw_premium_request,
)
from app.database import get_db
from app.models.premium_request import PremiumRequest
from app.schemas.premium_request import (
    PremiumRequestAdminOut,
    PremiumRequestOut,
)

router = APIRouter()


# ============================================================
# USER - REQUEST PREMIUM
# ============================================================

@router.post(
    "/",
    response_model=PremiumRequestOut,
    status_code=status.HTTP_201_CREATED,
)
def request_premium(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if current_user.role in ["premium", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have Premium access",
        )

    existing_request = get_pending_request_for_user(
        db,
        current_user.id,
    )

    if existing_request:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Premium request is already pending",
        )

    return create_premium_request(
        db,
        current_user.id,
    )


# ============================================================
# USER - VIEW MY LATEST REQUEST
# ============================================================

@router.get(
    "/my",
    response_model=PremiumRequestOut | None,
)
def get_my_premium_request(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_latest_request_for_user(
        db,
        current_user.id,
    )


# ============================================================
# ADMIN - VIEW ALL REQUESTS
# ============================================================

@router.get(
    "/",
    response_model=list[PremiumRequestAdminOut],
)
def get_premium_requests(
    db: Session = Depends(get_db),
    current_user=Depends(get_admin_user),
):
    requests = get_all_premium_requests(db)

    result = []

    for request in requests:
        result.append(
            PremiumRequestAdminOut(
                id=request.id,
                user_id=request.user_id,
                status=request.status,
                requested_at=request.requested_at,
                reviewed_at=request.reviewed_at,
                user_email=request.user.email,
            )
        )

    return result


# ============================================================
# ADMIN - APPROVE
# ============================================================

@router.put(
    "/{request_id}/approve",
    response_model=PremiumRequestOut,
)
def approve_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_admin_user),
):
    request = (
        db.query(PremiumRequest)
        .filter(PremiumRequest.id == request_id)
        .first()
    )

    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Premium request not found",
        )

    if request.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending requests can be approved",
        )

    return approve_premium_request(
        db,
        request,
        request.user,
    )


# ============================================================
# ADMIN - REJECT
# ============================================================

@router.put(
    "/{request_id}/reject",
    response_model=PremiumRequestOut,
)
def reject_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_admin_user),
):
    request = (
        db.query(PremiumRequest)
        .filter(PremiumRequest.id == request_id)
        .first()
    )

    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Premium request not found",
        )

    if request.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending requests can be rejected",
        )

    return reject_premium_request(
        db,
        request,
    )


# ============================================================
# ADMIN - WITHDRAW PREMIUM
# ============================================================

@router.put(
    "/{request_id}/withdraw",
    response_model=PremiumRequestOut,
)
def withdraw_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_admin_user),
):
    request = (
        db.query(PremiumRequest)
        .filter(PremiumRequest.id == request_id)
        .first()
    )

    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Premium request not found",
        )

    if request.status != "approved":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only approved Premium access can be withdrawn",
        )

    return withdraw_premium_request(
        db,
        request,
        request.user,
    )