from fastapi import APIRouter
from app.services.document_service import list_media, list_notes

router = APIRouter()

@router.get("/api/documents")
async def get_documents():
    return {
        "media": list_media(),
        "notes": list_notes()
    }
