from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class User(Base):
    __tablename__ = "users"  

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default="gen_random_uuid()"
    )

    clerk_id = Column(
        String,
        unique=True,
        nullable=False
    )

    email = Column(String)

    username = Column(String, unique=True)

    created_at = Column(
        DateTime,
        server_default=func.now()
    )