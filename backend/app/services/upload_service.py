from http.client import HTTPException

from app.storage.r2 import r2, BUCKET

async def upload_file(file):

    key = f"media/{file.filename}"

    print("Bucket:", BUCKET)
    print("Key:", key)

    MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File size exceeds 20MB limit.")
    file.file.seek(0)

    try:
        r2.upload_fileobj(
            file.file,
            BUCKET,
            key,
            ExtraArgs={"ContentType": file.content_type},
        )
        print("upload completed: ", key)
        
    except Exception as e:
        raise Exception(f"Failed to upload file: {str(e)}")

    return key