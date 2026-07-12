from datetime import datetime
from zoneinfo import ZoneInfo

from sqlalchemy import BigInteger, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import Base


class FileMetadata(Base):
    __tablename__ = "file"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    clerk_user_id: Mapped[str] = mapped_column(String, nullable=False)
    filename: Mapped[str] = mapped_column(String, nullable=False)
    r2_key: Mapped[str] = mapped_column(String, nullable=False)
    content_type: Mapped[str | None] = mapped_column(String)
    compression: Mapped[str | None] = mapped_column(String)
    size: Mapped[int] = mapped_column(BigInteger, nullable=False)
    file_type: Mapped[str] = mapped_column(String, nullable=False, server_default='media')

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(ZoneInfo("Asia/Singapore")),
    )
