from datetime import time

from pydantic import BaseModel, Field


# =========================================================
# CREATE SCHEDULE
# =========================================================

class ScheduleCreate(BaseModel):

    session_order: int = Field(
        gt=0
    )

    title: str = Field(
        min_length=2,
        max_length=200
    )

    start_time: time

    end_time: time

    description: str | None = None


# =========================================================
# UPDATE SCHEDULE
# =========================================================

class ScheduleUpdate(BaseModel):

    session_order: int | None = Field(
        default=None,
        gt=0
    )

    title: str | None = Field(
        default=None,
        min_length=2,
        max_length=200
    )

    start_time: time | None = None

    end_time: time | None = None

    description: str | None = None


# =========================================================
# SCHEDULE RESPONSE
# =========================================================

class ScheduleResponse(BaseModel):

    id: int

    event_id: int

    session_order: int

    title: str

    start_time: time

    end_time: time

    description: str | None

    model_config = {
        "from_attributes": True,
    }