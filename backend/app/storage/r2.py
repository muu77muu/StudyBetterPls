import os, boto3

r2 = boto3.client(
    "s3",
    endpoint_url=os.environ.get("S3_API_ENDPOINT"),
    aws_access_key_id=os.environ.get("R2_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("R2_SECRET_KEY"),
    region_name="auto",
)

BUCKET = os.environ.get("R2_BUCKET_NAME")