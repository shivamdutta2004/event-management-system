from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.event import Event
from app.models.registration import Registration
from app.models.user import User
from app.schemas.registration import (
    RegistrationResponse,
    RegistrationWithEventResponse,
)


router = APIRouter(
    prefix="/api/registrations",
    tags=["Registrations"],
)


# =========================================================
# GENERATE UNIQUE REGISTRATION NUMBER
# =========================================================

def generate_registration_number(
    db: Session,
) -> str:

    number = 1

    while True:

        registration_number = (
            f"REG-{number:05d}"
        )

        existing_registration = db.scalar(
            select(Registration.id).where(
                Registration.registration_number
                == registration_number
            )
        )

        if existing_registration is None:
            return registration_number

        number += 1


# =========================================================
# REGISTER FOR EVENT
# =========================================================

@router.post(
    "/events/{event_id}",
    response_model=RegistrationResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_for_event(
    event_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    # -----------------------------------------------------
    # CHECK USER ROLE
    # -----------------------------------------------------

    if current_user.role != "attendee":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only attendees can register for events.",
        )

    # -----------------------------------------------------
    # FIND EVENT
    # -----------------------------------------------------

    event = db.get(
        Event,
        event_id,
    )

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )

    # -----------------------------------------------------
    # CHECK EVENT STATUS
    # -----------------------------------------------------

    if event.status != "published":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This event is not open for registration.",
        )

    # -----------------------------------------------------
    # FIND EXISTING REGISTRATION
    # -----------------------------------------------------

    existing_registration = db.scalar(
        select(Registration).where(
            Registration.event_id == event_id,
            Registration.user_id == current_user.id,
        )
    )

    # -----------------------------------------------------
    # EXISTING CONFIRMED REGISTRATION
    # -----------------------------------------------------

    if (
        existing_registration
        and existing_registration.status == "confirmed"
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You are already registered for this event.",
        )

    # -----------------------------------------------------
    # COUNT CONFIRMED ATTENDEES
    # -----------------------------------------------------

    registered_count = (
        db.scalar(
            select(
                func.count(
                    Registration.id
                )
            ).where(
                Registration.event_id == event_id,
                Registration.status == "confirmed",
            )
        )
        or 0
    )

    # -----------------------------------------------------
    # CHECK EVENT CAPACITY
    # -----------------------------------------------------

    if registered_count >= event.max_attendees:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This event is fully booked.",
        )

    # -----------------------------------------------------
    # REACTIVATE CANCELLED REGISTRATION
    # -----------------------------------------------------

    if (
        existing_registration
        and existing_registration.status == "cancelled"
    ):

        now = datetime.utcnow()

        existing_registration.status = "confirmed"

        existing_registration.cancelled_at = None

        existing_registration.registered_at = now

        existing_registration.registration_number = (
            generate_registration_number(db)
        )

        db.commit()

        db.refresh(
            existing_registration
        )

        return existing_registration

    # -----------------------------------------------------
    # CREATE NEW REGISTRATION
    # -----------------------------------------------------

    registration = Registration(
        event_id=event.id,
        user_id=current_user.id,
        registration_number=generate_registration_number(
            db
        ),
        status="confirmed",
        registered_at=datetime.utcnow(),
        cancelled_at=None,
    )

    db.add(
        registration
    )

    db.commit()

    db.refresh(
        registration
    )

    return registration


# =========================================================
# MY REGISTRATIONS
# =========================================================

@router.get(
    "/me",
    response_model=list[
        RegistrationWithEventResponse
    ],
)
def get_my_registrations(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    rows = db.execute(
        select(
            Registration,
            Event,
        )
        .join(
            Event,
            Event.id == Registration.event_id,
        )
        .where(
            Registration.user_id == current_user.id
        )
        .order_by(
            Event.event_date.asc(),
            Event.start_time.asc(),
        )
    ).all()

    result = []

    for registration, event in rows:

        result.append(
            RegistrationWithEventResponse(
                id=registration.id,

                event_id=registration.event_id,

                user_id=registration.user_id,

                registration_number=(
                    registration.registration_number
                ),

                status=registration.status,

                registered_at=(
                    registration.registered_at
                ),

                event_title=event.title,

                event_date=(
                    event.event_date.isoformat()
                ),

                start_time=(
                    event.start_time.strftime(
                        "%H:%M:%S"
                    )
                ),

                end_time=(
                    event.end_time.strftime(
                        "%H:%M:%S"
                    )
                ),

                location=event.location,
            )
        )

    return result


# =========================================================
# ORGANIZER - VIEW EVENT REGISTRATIONS
# =========================================================

@router.get(
    "/events/{event_id}",
)
def get_event_registrations(
    event_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    # -----------------------------------------------------
    # CHECK ORGANIZER ROLE
    # -----------------------------------------------------

    if current_user.role != "organizer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only organizers can view event registrations."
            ),
        )

    # -----------------------------------------------------
    # FIND EVENT
    # -----------------------------------------------------

    event = db.get(
        Event,
        event_id,
    )

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found.",
        )

    # -----------------------------------------------------
    # CHECK EVENT OWNERSHIP
    # -----------------------------------------------------

    if event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You can only view registrations for your own events."
            ),
        )

    # -----------------------------------------------------
    # GET REGISTRATIONS + USERS
    # -----------------------------------------------------

    rows = db.execute(
        select(
            Registration,
            User,
        )
        .join(
            User,
            User.id == Registration.user_id,
        )
        .where(
            Registration.event_id == event_id
        )
        .order_by(
            Registration.registered_at.desc()
        )
    ).all()

    registrations = []

    # -----------------------------------------------------
    # BUILD RESULT
    # -----------------------------------------------------

    for registration, user in rows:

        registrations.append(
            {
                "id": registration.id,

                "registration_number": (
                    registration.registration_number
                ),

                "event_id": registration.event_id,

                "user_id": registration.user_id,

                "attendee_name": user.full_name,

                "attendee_email": user.email,

                "attendee_phone": user.phone,

                "status": registration.status,

                "registered_at": (
                    registration.registered_at
                ),

                "cancelled_at": (
                    registration.cancelled_at
                ),
            }
        )

    # -----------------------------------------------------
    # RETURN ORGANIZER REGISTRATION DATA
    # -----------------------------------------------------

    return {
        "event_id": event.id,

        "event_title": event.title,

        "event_capacity": event.max_attendees,

        "total_registrations": len(
            registrations
        ),

        "confirmed_registrations": sum(
            1
            for item in registrations
            if item["status"] == "confirmed"
        ),

        "cancelled_registrations": sum(
            1
            for item in registrations
            if item["status"] == "cancelled"
        ),

        "registrations": registrations,
    }


# =========================================================
# CANCEL REGISTRATION
# =========================================================

@router.delete(
    "/{registration_id}",
)
def cancel_registration(
    registration_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    registration = db.get(
        Registration,
        registration_id,
    )

    # -----------------------------------------------------
    # REGISTRATION NOT FOUND
    # -----------------------------------------------------

    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found.",
        )

    # -----------------------------------------------------
    # OWNERSHIP CHECK
    # -----------------------------------------------------

    if registration.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You can only cancel your own registration."
            ),
        )

    # -----------------------------------------------------
    # ALREADY CANCELLED
    # -----------------------------------------------------

    if registration.status == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration is already cancelled.",
        )

    # -----------------------------------------------------
    # CANCEL REGISTRATION
    # -----------------------------------------------------

    registration.status = "cancelled"

    registration.cancelled_at = (
        datetime.utcnow()
    )

    db.commit()

    return {
        "message": (
            "Registration cancelled successfully."
        ),
    }