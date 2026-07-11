from fastapi import Header, HTTPException

from app.auth.clerk import verify_token

def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header"
        )

    token = authorization.split(" ")[1]

    try:
        payload = verify_token(token)

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return { "id": payload["sub"] }