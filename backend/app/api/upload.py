from fastapi import APIRouter, UploadFile, File
from app.services.upload_service import upload_file

router = APIRouter()

@router.post("/api/upload")
async def upload(file: UploadFile = File(...)):

    result = await upload_file(file)
    return {"uploaded": True, "file_key": result}
