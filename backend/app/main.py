from dotenv import load_dotenv
from pathlib import Path

from app.routes import webhooks
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env.local")


from fastapi import FastAPI
from app.api.upload import router as upload_router
from app.api.documents import router as documents_router

app = FastAPI()
app.include_router(webhooks.router, prefix="/webhooks")
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