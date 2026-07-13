from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.user_dependency import get_current_user
from app.database.database import get_db
from app.services.document_service import get_document, list_media, list_notes

router = APIRouter()

@router.get("/documents")
async def get_documents(user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return {
        "media": await list_media(user["id"], db),
        "notes": await list_notes(user["id"], db),
    }


@router.get("/documents/{file_id}")
async def download_document(file_id: str, user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    metadata, stream = await get_document(file_id, user["id"], db)

    return StreamingResponse(
        stream,
        media_type=metadata.content_type,
        headers={ "Content-Disposition": f'inline; filename="{metadata.filename}"'}
    )