from sqlalchemy.orm import Session

from app.models.notification import Notification


def get_notifications(
    db: Session,
    user_id: int
):
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )


def get_notification(
    db: Session,
    notification_id: int,
    user_id: int
):
    return (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.user_id == user_id
        )
        .first()
    )


def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    notification_type: str = "general"
):
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notification_type
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification


def mark_notification_read(
    db: Session,
    notification: Notification
):
    notification.is_read = True

    db.commit()
    db.refresh(notification)

    return notification


def delete_notification(
    db: Session,
    notification: Notification
):
    db.delete(notification)
    db.commit()