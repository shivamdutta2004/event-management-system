from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers.auth import router as auth_router
from app.routers.events import router as events_router
from app.routers.schedules import router as schedules_router
from app.routers.registrations import router as registrations_router


app = FastAPI(
    title="Evently API",
    description="Backend API for the Evently Event Management System",
    version="1.0.0",
)


# =========================================================
# CORS CONFIGURATION
# =========================================================

allowed_origins = [
    # Local development
    "http://localhost:5173",
    "http://127.0.0.1:5173",

    # Production frontend
    "https://event-management-system-rho-seven.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# STATIC UPLOAD FILES
# =========================================================

# Profile images are stored in:
# backend/app/uploads/

UPLOADS_DIR = (
    Path(__file__).resolve().parent
    / "uploads"
)

UPLOADS_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

app.mount(
    "/uploads",
    StaticFiles(
        directory=str(UPLOADS_DIR)
    ),
    name="uploads",
)


# =========================================================
# API ROUTERS
# =========================================================

app.include_router(auth_router)
app.include_router(events_router)
app.include_router(schedules_router)
app.include_router(registrations_router)


# =========================================================
# ROOT ENDPOINT
# =========================================================

@app.get("/")
def root():
    return {
        "message": "Evently API is running",
        "status": "success",
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }