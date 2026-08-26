from datetime import date, time, datetime

from pydantic import BaseModel, Field


# =========================================================
# CREATE EVENT
# =========================================================

class EventCreate(BaseModel):

    title: str = Field(
        min_length=3,
        max_length=200,
    )

    category: str = Field(
        min_length=2,
        max_length=100,
    )

    description: str = Field(
        min_length=10,
    )

    cover_image: str | None = None

    event_date: date

    start_time: time

    end_time: time

    location: str = Field(
        min_length=2,
        max_length=300,
    )

    max_attendees: int = Field(
        gt=0,
    )


# =========================================================
# UPDATE EVENT
# =========================================================

class EventUpdate(BaseModel):

    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=200,
    )

    category: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    description: str | None = Field(
        default=None,
        min_length=10,
    )

    cover_image: str | None = None

    event_date: date | None = None

    start_time: time | None = None

    end_time: time | None = None

    location: str | None = Field(
        default=None,
        min_length=2,
        max_length=300,
    )

    max_attendees: int | None = Field(
        default=None,
        gt=0,
    )

    status: str | None = None


# =========================================================
# EVENT RESPONSE
# =========================================================

class EventResponse(BaseModel):

    id: int

    title: str

    category: str

    description: str

    cover_image: str | None

    event_date: date

    start_time: time

    end_time: time

    location: str

    max_attendees: int

    organizer_id: int

    organizer_name: str

    attendee_count: int

    status: str

    created_at: datetime

    model_config = {
        "from_attributes": True,
    }