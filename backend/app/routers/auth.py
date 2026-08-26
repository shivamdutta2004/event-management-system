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
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    ProfileUpdate,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


# =========================================================
# PROFILE IMAGE CONFIGURATION
# =========================================================

BASE_DIR = Path(__file__).resolve().parents[1]
PROFILE_UPLOAD_DIR = (
    BASE_DIR / "uploads" / "profile-images"
)

PROFILE_UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024


# =========================================================
# PASSWORD CHANGE REQUEST
# =========================================================

class PasswordChangeRequest(BaseModel):
    current_password: str = Field(
        min_length=1,
        max_length=128,
    )

    new_password: str = Field(
        min_length=8,
        max_length=128,
    )


# =========================================================
# REGISTER
# =========================================================

@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    payload: RegisterRequest,
    db: Session = Depends(get_db),
):
    existing_user = db.scalar(
        select(User).where(
            User.email == payload.email
        )
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    role = payload.role.lower().strip()

    if role not in {"attendee", "organizer"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be attendee or organizer.",
        )

    user = User(
        full_name=payload.full_name.strip(),
        email=payload.email.lower().strip(),
        password_hash=hash_password(
            payload.password
        ),
        role=role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(
        {
            "sub": str(user.id),
            "role": user.role,
        }
    )

    return TokenResponse(
        access_token=token,
        user=user,
    )


# =========================================================
# LOGIN
# =========================================================

@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
):
    user = db.scalar(
        select(User).where(
            User.email == payload.email.lower().strip()
        )
    )

    if (
        not user
        or not verify_password(
            payload.password,
            user.password_hash,
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is inactive.",
        )

    token = create_access_token(
        {
            "sub": str(user.id),
            "role": user.role,
        }
    )

    return TokenResponse(
        access_token=token,
        user=user,
    )


# =========================================================
# GET CURRENT USER
# =========================================================

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(
        get_current_user
    ),
):
    return current_user


# =========================================================
# UPDATE CURRENT USER PROFILE
# =========================================================

@router.patch(
    "/me",
    response_model=UserResponse,
)
def update_me(
    payload: ProfileUpdate,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    current_user.full_name = (
        payload.full_name.strip()
    )

    current_user.phone = (
        payload.phone.strip()
        if payload.phone
        else None
    )

    current_user.organization = (
        payload.organization.strip()
        if payload.organization
        else None
    )

    current_user.bio = (
        payload.bio.strip()
        if payload.bio
        else None
    )

    db.commit()
    db.refresh(current_user)

    return current_user


# =========================================================
# UPLOAD PROFILE IMAGE
# =========================================================

@router.post(
    "/me/profile-image",
    response_model=UserResponse,
)
async def upload_profile_image(
    file: UploadFile = File(...),
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    # -----------------------------------------------------
    # CHECK FILE TYPE
    # -----------------------------------------------------

    extension = ALLOWED_IMAGE_TYPES.get(
        file.content_type
    )

    if extension is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a PNG, JPG or WEBP image.",
        )

    # -----------------------------------------------------
    # READ FILE
    # -----------------------------------------------------

    contents = await file.read()

    if len(contents) > MAX_PROFILE_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Image size must be 5 MB or less.",
        )

    if not contents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded image is empty.",
        )

    # -----------------------------------------------------
    # REMOVE OLD LOCAL IMAGE
    # -----------------------------------------------------

    old_image_path = current_user.profile_image

    if old_image_path:
        old_filename = Path(
            old_image_path
        ).name

        old_file = (
            PROFILE_UPLOAD_DIR
            / old_filename
        )

        if old_file.exists():
            try:
                old_file.unlink()
            except OSError:
                pass

    # -----------------------------------------------------
    # CREATE UNIQUE FILE NAME
    # -----------------------------------------------------

    filename = (
        f"{uuid4().hex}{extension}"
    )

    destination = (
        PROFILE_UPLOAD_DIR
        / filename
    )

    # -----------------------------------------------------
    # SAVE FILE
    # -----------------------------------------------------

    destination.write_bytes(contents)

    # -----------------------------------------------------
    # SAVE PUBLIC API PATH
    # -----------------------------------------------------

    current_user.profile_image = (
        f"/uploads/profile-images/{filename}"
    )

    db.commit()
    db.refresh(current_user)

    return current_user


# =========================================================
# CHANGE CURRENT USER PASSWORD
# =========================================================

@router.post(
    "/change-password",
)
def change_password(
    payload: PasswordChangeRequest,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    # -----------------------------------------------------
    # VERIFY CURRENT PASSWORD
    # -----------------------------------------------------

    if not verify_password(
        payload.current_password,
        current_user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect.",
        )

    # -----------------------------------------------------
    # PREVENT REUSING SAME PASSWORD
    # -----------------------------------------------------

    if verify_password(
        payload.new_password,
        current_user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from your current password.",
        )

    # -----------------------------------------------------
    # UPDATE PASSWORD
    # -----------------------------------------------------

    current_user.password_hash = hash_password(
        payload.new_password
    )

    db.commit()

    return {
        "message": "Password updated successfully.",
    }


# =========================================================
# SWAGGER OAUTH2 TOKEN
# =========================================================

@router.post(
    "/token",
    include_in_schema=False,
)
def login_for_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = db.scalar(
        select(User).where(
            User.email
            == form_data.username.lower().strip()
        )
    )

    if (
        not user
        or not verify_password(
            form_data.password,
            user.password_hash,
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive.",
        )

    token = create_access_token(
        {
            "sub": str(user.id),
            "role": user.role,
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
    }