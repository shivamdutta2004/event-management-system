from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.event import Event
from app.models.schedule import Schedule
from app.models.user import User
from app.schemas.schedule import (
    ScheduleCreate,
    ScheduleResponse,
    ScheduleUpdate,
)


router = APIRouter(
    prefix="/api/events/{event_id}/schedules",
    tags=["Schedules"],
)


# =========================================================
# GET OWNED EVENT
# =========================================================

def get_owned_event(
    event_id: int,
    current_user: User,
    db: Session,
) -> Event:
    event = db.get(
        Event,
        event_id,
    )

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )

    if current_user.role != "organizer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only organizers can manage schedules.",
        )

    if event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only manage schedules for your own events.",
        )

    return event


# =========================================================
# GET SCHEDULE
# =========================================================

@router.get(
    "",
    response_model=list[ScheduleResponse],
)
def get_schedule(
    event_id: int,
    db: Session = Depends(get_db),
):
    event = db.get(
        Event,
        event_id,
    )

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )

    schedules = db.scalars(
        select(Schedule)
        .where(
            Schedule.event_id == event_id
        )
        .order_by(
            Schedule.session_order.asc()
        )
    ).all()

    return schedules


# =========================================================
# CREATE SCHEDULE SESSION
# =========================================================

@router.post(
    "",
    response_model=ScheduleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_schedule(
    event_id: int,
    payload: ScheduleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    get_owned_event(
        event_id,
        current_user,
        db,
    )

    if payload.end_time <= payload.start_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End time must be after start time.",
        )

    schedule = Schedule(
        event_id=event_id,
        session_order=payload.session_order,
        title=payload.title.strip(),
        start_time=payload.start_time,
        end_time=payload.end_time,
        description=(
            payload.description.strip()
            if payload.description
            else None
        ),
    )

    db.add(schedule)
    db.commit()
    db.refresh(schedule)

    return schedule


# =========================================================
# UPDATE SCHEDULE SESSION
# =========================================================

@router.put(
    "/{schedule_id}",
    response_model=ScheduleResponse,
)
def update_schedule(
    event_id: int,
    schedule_id: int,
    payload: ScheduleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    event = get_owned_event(
        event_id,
        current_user,
        db,
    )

    schedule = db.scalar(
        select(Schedule)
        .where(
            Schedule.id == schedule_id,
            Schedule.event_id == event.id,
        )
    )

    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule session not found.",
        )

    updates = payload.model_dump(
        exclude_unset=True
    )

    # ---------------------------------------------------------
    # CALCULATE VALUES AFTER UPDATE
    # ---------------------------------------------------------

    new_start_time = updates.get(
        "start_time",
        schedule.start_time,
    )

    new_end_time = updates.get(
        "end_time",
        schedule.end_time,
    )

    # ---------------------------------------------------------
    # VALIDATE TIMES BEFORE MODIFYING OBJECT
    # ---------------------------------------------------------

    if new_end_time <= new_start_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End time must be after start time.",
        )

    # ---------------------------------------------------------
    # APPLY UPDATE
    # ---------------------------------------------------------

    for field, value in updates.items():
        if isinstance(value, str):
            value = value.strip()

        setattr(
            schedule,
            field,
            value,
        )

    db.commit()
    db.refresh(schedule)

    return schedule


# =========================================================
# DELETE SCHEDULE SESSION
# =========================================================

@router.delete(
    "/{schedule_id}",
)
def delete_schedule(
    event_id: int,
    schedule_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    event = get_owned_event(
        event_id,
        current_user,
        db,
    )

    schedule = db.scalar(
        select(Schedule)
        .where(
            Schedule.id == schedule_id,
            Schedule.event_id == event.id,
        )
    )

    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule session not found.",
        )

    # ---------------------------------------------------------
    # EXPLICIT OWNERSHIP CHECK
    # ---------------------------------------------------------

    if schedule.event_id != event.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only manage schedules for your own events.",
        )

    if event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only manage schedules for your own events.",
        )

    db.delete(schedule)
    db.commit()

    return {
        "message": "Schedule session deleted successfully.",
    }