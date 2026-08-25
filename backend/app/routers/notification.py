from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.crud.notification import (
    delete_notification,
    get_notification,
    get_notifications,
    mark_notification_read,
)
from app.database import get_db
from app.models.user import User
from app.schemas.notification import (
    NotificationOut,
)

router = APIRouter()


@router.get(
    "/",
    response_model=list[NotificationOut]
)
def list_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_notifications(
        db,
        current_user.id
    )


@router.patch(
    "/{notification_id}/read",
    response_model=NotificationOut
)
def read_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notification = get_notification(
        db,
        notification_id,
        current_user.id
    )

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )

    return mark_notification_read(
        db,
        notification
    )


@router.delete(
    "/{notification_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def remove_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notification = get_notification(
        db,
        notification_id,
        current_user.id
    )

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )

    delete_notification(
        db,
        notification
    )

    return None