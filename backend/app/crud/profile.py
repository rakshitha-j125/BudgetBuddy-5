from sqlalchemy.orm import Session

from app.models.profile import Profile


def get_profile(
    db: Session,
    user_id: int,
):
    return (
        db.query(Profile)
        .filter(Profile.user_id == user_id)
        .first()
    )


def update_profile(
    db: Session,
    profile: Profile,
    profile_data,
):
    if profile_data.full_name is not None:
        profile.full_name = profile_data.full_name

    if profile_data.monthly_income is not None:
        profile.monthly_income = profile_data.monthly_income

    if profile_data.currency is not None:
        profile.currency = profile_data.currency

    if profile_data.financial_goal is not None:
        profile.financial_goal = profile_data.financial_goal

    db.commit()
    db.refresh(profile)

    return profile