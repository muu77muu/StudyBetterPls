from sqlalchemy import Column, String, BigInteger, DateTime
from sqlalchemy.sql import func
from app.database.database import Base

class FileMetadata(Base):
    __tablename__ = "file"

    id = Column(
        String,
        primary_key=True
    )

    clerk_user_id = Column(
        String,
        nullable=False,
        index=True
    )

    filename = Column(
        String,
        nullable=False
    )

    r2_key = Column(
        String,
        nullable=False,
        unique=True
    )

    content_type = Column(
        String
    )

    size = Column(
        BigInteger
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )