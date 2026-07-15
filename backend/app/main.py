from dotenv import load_dotenv
from pathlib import Path
from os import getenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env.local")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.upload import router as upload_router
from app.routes.documents import router as documents_router

app = FastAPI()

origins = [ getenv("FRONTEND_URL") ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(documents_router)

@app.get("/")
async def root():
    return {
        "message": "Backend running"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }