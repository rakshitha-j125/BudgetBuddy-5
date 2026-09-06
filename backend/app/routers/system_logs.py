from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_admin_user
from app.database import get_db
from app.models.system_log import SystemLog

router = APIRouter()


@router.get("/")
def get_system_logs(
    db: Session = Depends(get_db),
    current_user=Depends(get_admin_user),
):
    logs = (
        db.query(SystemLog)
        .order_by(SystemLog.created_at.desc())
        .all()
    )

    return [
        {
            "id": log.id,
            "user_id": log.user_id,
            "action": log.action,
            "description": log.description,
            "created_at": log.created_at,
        }
        for log in logs
    ]