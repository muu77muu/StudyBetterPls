import jwt, os
from pathlib import Path

from jwt import PyJWKClient
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]  
load_dotenv(BASE_DIR / ".env.local")

CLERK_JWKS_URL = os.getenv("JWKS_URL")
CLERK_JWT_ISSUER = os.getenv("ISSUER")

jwks_client = PyJWKClient(CLERK_JWKS_URL)


def verify_token(token: str):
    signing_key = jwks_client.get_signing_key_from_jwt(token)

    payload = jwt.decode(
        token,
        signing_key.key,
        algorithms=["RS256"],
        issuer=CLERK_JWT_ISSUER,
        options={
            "verify_aud": False,
        },
    )

    return payload