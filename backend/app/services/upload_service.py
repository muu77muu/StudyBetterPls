from app.storage.r2 import r2, BUCKET

async def upload_file(file):

    key = f"media/{file.filename}"

    print("Bucket:", BUCKET)
    print("Key:", key)

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