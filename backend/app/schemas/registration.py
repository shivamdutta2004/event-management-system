from datetime import datetime

from pydantic import BaseModel


# =========================================================
# REGISTRATION RESPONSE
# =========================================================

class RegistrationResponse(BaseModel):
    id: int
    event_id: int
    user_id: int
    registration_number: str
    status: str
    registered_at: datetime

    model_config = {
        "from_attributes": True,
    }


# =========================================================
# REGISTRATION WITH EVENT DETAILS
# =========================================================

class RegistrationWithEventResponse(RegistrationResponse):
    event_title: str
    event_date: str
    start_time: str
    end_time: str
    location: str