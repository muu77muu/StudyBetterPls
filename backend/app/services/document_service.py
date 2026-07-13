from io import BytesIO
import zstandard as zstd

from botocore.exceptions import ClientError
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.filemetadata_model import FileMetadata
from app.storage.r2 import BUCKET, get_r2_client

async def list_media(clerk_user_id: str, db: AsyncSession):
    result = await db.execute(
        select(FileMetadata)
        .where(
            FileMetadata.clerk_user_id == clerk_user_id,
            FileMetadata.file_type == "media",
        )
        .order_by(FileMetadata.created_at.desc())
    )

    return [
        {
            "id": f.id,
            "filename": f.filename,
            "size": f.size,
            "content_type": f.content_type,
            "created_at": f.created_at.isoformat(),
        }
        for f in result.scalars().all()
    ]


async def list_notes(clerk_user_id: str, db: AsyncSession):
    result = await db.execute(
        select(FileMetadata)
        .where(
            FileMetadata.clerk_user_id == clerk_user_id,
            FileMetadata.file_type == "notes",
        )
        .order_by(FileMetadata.created_at.desc())
    )

    return [
        {
            "id": f.id,
            "filename": f.filename,
            "size": f.size,
            "content_type": f.content_type,
            "created_at": f.created_at.isoformat(),
        }
        for f in result.scalars().all()
    ]


async def get_document(file_id: str, clerk_user_id: str, db: AsyncSession):
    result = await db.execute(
        select(FileMetadata).where(
            FileMetadata.id == file_id,
            FileMetadata.clerk_user_id == clerk_user_id,
        )
    )

    metadata = result.scalar_one_or_none()
    if metadata is None:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        async with (await get_r2_client()) as r2:
            response = await r2.get_object(
                Bucket=BUCKET,
                Key=metadata.r2_key,
            )

            body = await response["Body"].read()

    except ClientError:
        raise HTTPException(status_code=404, detail="Object missing from storage")

    if metadata.compression == "zstd":
        body = zstd.ZstdDecompressor().decompress(body)

    return metadata, BytesIO(body)