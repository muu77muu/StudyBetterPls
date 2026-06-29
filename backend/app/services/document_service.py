from app.storage.r2 import r2, BUCKET

def list_media():

    try:
        response = r2.list_objects_v2(Bucket=BUCKET, Prefix="media/")
        media_files = []
        for obj in response.get('Contents', []):
            media_files.append({
                "key": obj['Key'],
                "name": obj['Key'].replace("media/", ""),
                "size": obj['Size'],
                "last_modified": obj['LastModified'].isoformat(),
            })
        return media_files
    
    except Exception as e:
        raise Exception(f"Failed to list media: {str(e)}")
    
def list_notes():

    try:
        response = r2.list_objects_v2(Bucket=BUCKET, Prefix="notes/")
        notes = []
        for obj in response.get('Contents', []):
            notes.append({
                "key": obj['Key'],
                "name": obj['Key'].replace("notes/", ""),
                "size": obj['Size'],
                "last_modified": obj['LastModified'].isoformat(),
            })
        return notes
    
    except Exception as e:
        raise Exception(f"Failed to list notes: {str(e)}")