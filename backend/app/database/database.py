import os
import ssl

from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import (create_async_engine, async_sessionmaker, AsyncSession)
from sqlalchemy.orm import DeclarativeBase

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env.local")
DATABASE_URL = os.getenv("DATABASE_URL")

class Base(DeclarativeBase):
    pass

ssl_context = ssl.create_default_context()

engine = create_async_engine(
    DATABASE_URL,
    connect_args={"ssl": ssl_context},
    echo=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session