from fastapi import Header, HTTPException

from app.auth.clerk import verify_token

async def get_current_user(authorization: str = Header(...),):
    if not authorization.startswith("Bearer "):
        raise HTTPException(401)

    token = authorization[7:]

    try:
        return verify_token(token)

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )