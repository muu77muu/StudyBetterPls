from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env.local")


from fastapi import FastAPI
from app.routes.upload import router as upload_router
from app.routes.documents import router as documents_router

app = FastAPI()
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