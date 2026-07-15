import os
import aioboto3

from dotenv import load_dotenv
load_dotenv()

BUCKET = os.environ.get("R2_BUCKET_NAME")
R2_SESSION = aioboto3.Session()

async def get_r2_client():
    return R2_SESSION.client(
        "s3",
        endpoint_url=os.environ.get("S3_API_ENDPOINT"),
        aws_access_key_id=os.environ.get("R2_ACCESS_KEY_ID"),
        aws_secret_access_key=os.environ.get("R2_SECRET_KEY"),
        region_name="auto",
    )
