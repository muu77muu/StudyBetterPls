from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
)

from sqlalchemy.ext.asyncio import AsyncSession

from app.database.database import get_db
from app.auth.user_dependency import get_current_user
from app.services.upload_service import upload_file

router = APIRouter()

@router.post("/upload")
async def upload(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):

    record = await upload_file(
        file=file,
        clerk_user_id=user["id"],
        db=db,
    )

    return {
        "success": True,
        "file_id": record.id,
        "key": record.r2_key,
    }