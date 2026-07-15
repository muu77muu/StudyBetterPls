from uuid import uuid4

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

import zstandard as zstd
import filetype

from app.storage.r2 import (get_r2_client, BUCKET)
from app.models.filemetadata_model import FileMetadata

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB

ALLOWED_NOTES_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  # docx
    "application/msword",                                                       # doc
    "text/plain",
    "text/markdown",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",# pptx
    "application/vnd.ms-powerpoint",                                            # ppt
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",        # xlsx
}

ALLOWED_MEDIA_TYPES = {
    "audio/mpeg",
    "audio/mp4",
    "audio/wav",
    "audio/ogg",
    "image/jpeg",
    "image/png",
    "image/webp",
}

COMPRESSIBLE_TYPES = {
    "application/pdf",
    "text/plain",
    "text/markdown",
    "text/csv",
    "application/json",
    "application/xml",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
}

async def delete_r2_object(key: str):
    async with get_r2_client() as s3:
        await s3.delete_object(
            Bucket=BUCKET,
            Key=key,
        )

def compress_file(contents: bytes):
    compressor = zstd.ZstdCompressor(level=10)
    return compressor.compress(contents)

def validate_file(contents: bytes, upload_type: str, declared_type: str):
    file_kind = filetype.guess(contents)

    if upload_type == "notes":
        allowed = ALLOWED_NOTES_TYPES
    elif upload_type == "media":
        allowed = ALLOWED_MEDIA_TYPES
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid upload type."
        )

    if file_kind is not None:
        detected = file_kind.mime

        if detected not in allowed:
            raise HTTPException(
                status_code=415,
                detail=f"Unsupported file type ({detected})."
            )

        return detected

    if declared_type in allowed:
        return declared_type

    raise HTTPException(
        status_code=415,
        detail="Unsupported or corrupted file."
    )

async def upload_file(file, type: str, clerk_user_id: str, db: AsyncSession):

    if file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File size exceeds 20MB limit."
        )
    
    contents = await file.read()
    await file.seek(0)  # Reset the file pointer to the beginning after reading
    original_size = len(contents)
    validated_type = validate_file(contents, type, file.content_type)

    compression = None
    upload_body = contents

    if file.content_type in COMPRESSIBLE_TYPES:
        compressed_contents = compress_file(contents)
        if len(compressed_contents) < original_size:
            upload_body = compressed_contents
            compression = "zstd"

    safe_filename = file.filename.replace("/", "_")

    key = (
        f"users/"
        f"{clerk_user_id}/"
        f"{type}/"
        f"{uuid4()}-{safe_filename}"
    )

    uploaded_to_r2 = False

    try:
        async with (await get_r2_client()) as s3:
            await s3.put_object(
                Body=upload_body,
                Bucket=BUCKET,
                Key=key,
                ContentType=(
                    "application/zstd" if compression == "zstd" else validated_type
                ),
                Metadata={
                    "original-filename": safe_filename,
                    "compression": compression or "none",
                }
            )
        
        uploaded_to_r2 = True

        metadata = FileMetadata(
            id=str(uuid4()),
            clerk_user_id=clerk_user_id,
            filename=safe_filename,
            r2_key=key,
            content_type=file.content_type,
            size=(original_size if compression is None else len(upload_body)),
            file_type=type,
            compression=compression,
        )

        db.add(metadata)
        await db.commit()
        await db.refresh(metadata)

        return metadata
    
    except Exception as e:
        await db.rollback()

        if uploaded_to_r2:
            try:
                await delete_r2_object(key)
                
            except Exception as delete_error:
                print(f"Failed to delete R2 object: {str(delete_error)}")

        raise Exception(f"Failed to upload file: {str(e)}")
