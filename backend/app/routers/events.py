from datetime import date
from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)

from sqlalchemy import delete, func, select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.event import Event
from app.models.registration import Registration
from app.models.schedule import Schedule
from app.models.user import User
from app.schemas.event import (
    EventCreate,
    EventResponse,
    EventUpdate,
)


router = APIRouter(
    prefix="/api/events",
    tags=["Events"],
)


# =========================================================
# BUILD EVENT RESPONSE
# =========================================================

def build_event_response(
    db: Session,
    event: Event,
) -> EventResponse:

    organizer = db.get(
        User,
        event.organizer_id,
    )

    if not organizer:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Event organizer not found.",
        )

    attendee_count = db.scalar(
        select(
            func.count(Registration.id)
        ).where(
            Registration.event_id == event.id,
            Registration.status == "confirmed",
        )
    ) or 0

    return EventResponse(
        id=event.id,
        title=event.title,
        category=event.category,
        description=event.description,
        cover_image=event.cover_image,
        event_date=event.event_date,
        start_time=event.start_time,
        end_time=event.end_time,
        location=event.location,
        max_attendees=event.max_attendees,
        organizer_id=event.organizer_id,
        organizer_name=organizer.full_name,
        attendee_count=attendee_count,
        status=event.status,
        created_at=event.created_at,
    )


# =========================================================
# GET ALL EVENTS
# =========================================================

@router.get(
    "",
    response_model=list[EventResponse],
)
def get_events(
    db: Session = Depends(get_db),
):

    events = db.scalars(
        select(Event)
        .where(
            Event.status == "published"
        )
        .order_by(
            Event.event_date.asc(),
            Event.start_time.asc(),
        )
    ).all()

    return [
        build_event_response(
            db,
            event,
        )
        for event in events
    ]


# =========================================================
# UPLOAD EVENT COVER
# =========================================================

@router.post(
    "/upload-cover",
)
async def upload_event_cover(
    file: UploadFile = File(...),
    current_user: User = Depends(
        get_current_user
    ),
):

    # ---------------------------------------------------------
    # ORGANIZER ONLY
    # ---------------------------------------------------------

    if current_user.role != "organizer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only organizers can upload event covers.",
        )

    # ---------------------------------------------------------
    # VALIDATE FILE TYPE
    # ---------------------------------------------------------

    allowed_types = {
        "image/png",
        "image/jpeg",
        "image/webp",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a PNG, JPG or WEBP image.",
        )

    # ---------------------------------------------------------
    # READ FILE
    # ---------------------------------------------------------

    file_bytes = await file.read()

    # ---------------------------------------------------------
    # VALIDATE FILE SIZE
    # ---------------------------------------------------------

    max_size = 5 * 1024 * 1024

    if len(file_bytes) > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image size must be 5 MB or less.",
        )

    # ---------------------------------------------------------
    # UPLOAD DIRECTORY
    # ---------------------------------------------------------

    uploads_dir = (
        Path(__file__).resolve().parent.parent
        / "uploads"
        / "event_covers"
    )

    uploads_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    # ---------------------------------------------------------
    # SAFE FILE EXTENSION
    # ---------------------------------------------------------

    extension_map = {
        "image/png": ".png",
        "image/jpeg": ".jpg",
        "image/webp": ".webp",
    }

    extension = extension_map[
        file.content_type
    ]

    filename = (
        f"{uuid4().hex}{extension}"
    )

    file_path = uploads_dir / filename

    # ---------------------------------------------------------
    # SAVE FILE
    # ---------------------------------------------------------

    file_path.write_bytes(
        file_bytes
    )

    # ---------------------------------------------------------
    # RETURN PATH
    # ---------------------------------------------------------

    return {
        "cover_image": (
            f"/uploads/event_covers/{filename}"
        )
    }


# =========================================================
# GET EVENT BY ID
# =========================================================

@router.get(
    "/{event_id}",
    response_model=EventResponse,
)
def get_event(
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

    return build_event_response(
        db,
        event,
    )


# =========================================================
# CREATE EVENT
# =========================================================

@router.post(
    "",
    response_model=EventResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_event(
    payload: EventCreate,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    if current_user.role != "organizer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only organizers can create events.",
        )

    if payload.end_time <= payload.start_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End time must be after start time.",
        )

    # ---------------------------------------------------------
    # VALIDATE PUBLISHED EVENT DATE
    # ---------------------------------------------------------

    if payload.event_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Published events must have a date today or in the future.",
        )

    event = Event(
        title=payload.title.strip(),
        category=payload.category.strip().title(),
        description=payload.description.strip(),
        cover_image=payload.cover_image,
        event_date=payload.event_date,
        start_time=payload.start_time,
        end_time=payload.end_time,
        location=payload.location.strip(),
        max_attendees=payload.max_attendees,
        organizer_id=current_user.id,
        status="published",
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return build_event_response(
        db,
        event,
    )


# =========================================================
# UPDATE EVENT
# =========================================================

@router.put(
    "/{event_id}",
    response_model=EventResponse,
)
def update_event(
    event_id: int,
    payload: EventUpdate,
    current_user: User = Depends(
        get_current_user
    ),
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

    if event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own events.",
        )

    updates = payload.model_dump(
        exclude_unset=True
    )

    # ---------------------------------------------------------
    # CALCULATE VALUES AFTER UPDATE
    # ---------------------------------------------------------

    new_start_time = updates.get(
        "start_time",
        event.start_time,
    )

    new_end_time = updates.get(
        "end_time",
        event.end_time,
    )

    new_max_attendees = updates.get(
        "max_attendees",
        event.max_attendees,
    )

    new_event_date = updates.get(
        "event_date",
        event.event_date,
    )

    new_status = updates.get(
        "status",
        event.status,
    )

    # ---------------------------------------------------------
    # VALIDATE EVENT TIME
    # ---------------------------------------------------------

    if new_start_time >= new_end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End time must be after start time.",
        )

    # ---------------------------------------------------------
    # VALIDATE PUBLISHED EVENT DATE
    # ---------------------------------------------------------

    if (
        new_status == "published"
        and new_event_date < date.today()
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Published events must have a date today or in the future.",
        )

    # ---------------------------------------------------------
    # VALIDATE CAPACITY
    # ---------------------------------------------------------

    confirmed_registrations = db.scalar(
        select(
            func.count(Registration.id)
        ).where(
            Registration.event_id == event.id,
            Registration.status == "confirmed",
        )
    ) or 0

    if new_max_attendees < confirmed_registrations:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Maximum attendees cannot be lower than "
                f"the current confirmed registrations ({confirmed_registrations})."
            ),
        )

    # ---------------------------------------------------------
    # APPLY UPDATES
    # ---------------------------------------------------------

    for field, value in updates.items():

        if isinstance(value, str):
            value = value.strip()

            if field == "category":
                value = value.title()

        setattr(
            event,
            field,
            value,
        )

    db.commit()
    db.refresh(event)

    return build_event_response(
        db,
        event,
    )


# =========================================================
# DELETE EVENT
# =========================================================

@router.delete(
    "/{event_id}",
)
def delete_event(
    event_id: int,
    current_user: User = Depends(
        get_current_user
    ),
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

    if event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own events.",
        )

    # ---------------------------------------------------------
    # DELETE DEPENDENT REGISTRATIONS
    # ---------------------------------------------------------

    db.execute(
        delete(Registration).where(
            Registration.event_id == event_id
        )
    )

    # ---------------------------------------------------------
    # DELETE DEPENDENT SCHEDULES
    # ---------------------------------------------------------

    db.execute(
        delete(Schedule).where(
            Schedule.event_id == event_id
        )
    )

    # ---------------------------------------------------------
    # DELETE EVENT
    # ---------------------------------------------------------

    db.delete(event)

    db.commit()

    return {
        "message": "Event deleted successfully.",
    }