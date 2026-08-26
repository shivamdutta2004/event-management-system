from app.database import Base, engine

from app.models.user import User
from app.models.event import Event
from app.models.registration import Registration
from app.models.schedule import Schedule


Base.metadata.create_all(bind=engine)

print("Evently database tables created successfully.")