from pydantic import BaseModel, EmailStr, Field


# =========================================================
# REGISTER REQUEST
# =========================================================

class RegisterRequest(BaseModel):
    full_name: str = Field(
        min_length=2,
        max_length=150,
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
    )

    role: str = "attendee"


# =========================================================
# LOGIN REQUEST
# =========================================================

class LoginRequest(BaseModel):
    email: EmailStr

    password: str = Field(
        min_length=1,
    )


# =========================================================
# USER RESPONSE
# =========================================================

class UserResponse(BaseModel):
    id: int

    full_name: str

    email: EmailStr

    role: str

    phone: str | None = None

    organization: str | None = None

    bio: str | None = None

    profile_image: str | None = None

    model_config = {
        "from_attributes": True,
    }


# =========================================================
# TOKEN RESPONSE
# =========================================================

class TokenResponse(BaseModel):
    access_token: str

    token_type: str = "bearer"

    user: UserResponse


# =========================================================
# PROFILE UPDATE
# =========================================================

class ProfileUpdate(BaseModel):
    full_name: str = Field(
        min_length=2,
        max_length=150,
    )

    phone: str | None = Field(
        default=None,
        max_length=30,
    )

    organization: str | None = Field(
        default=None,
        max_length=200,
    )

    bio: str | None = None