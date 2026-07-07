import os

from fastapi import APIRouter, Request, HTTPException
from svix.webhooks import Webhook

from app.database.database import SessionLocal
from app.models.users_model import User

router = APIRouter()

@router.post("/clerk")
async def clerk_webhook(request: Request):
    payload = await request.body()

    headers = {
        "svix-id": request.headers.get("svix-id"),
        "svix-timestamp": request.headers.get("svix-timestamp"),
        "svix-signature": request.headers.get("svix-signature"),
    }

    webhook_secret = os.getenv("CLERK_WEBHOOK_SECRET")

    if not webhook_secret:
        raise HTTPException(
            status_code=500,
            detail="Missing Clerk webhook secret"
        )

    try:
        wh = Webhook(webhook_secret)
        event = wh.verify(payload,headers)

    except Exception as e:
        print("Webhook verification failed:", e)

        raise HTTPException(
            status_code=400,
            detail="Invalid webhook signature"
        )

    event_type = event["type"]
    data = event["data"]
    db = SessionLocal()

    try:
        if event_type == "user.created":
            email_addresses = data.get("email_addresses",[])
            email = (email_addresses[0]["email_address"] if email_addresses else None)

            user = User(
                clerk_id=data["id"],
                email=email,
                username=data.get("username")
            )

            db.add(user)
            db.commit()

        elif event_type == "user.updated":
            user = (db.query(User)
                .filter(User.clerk_id == data["id"])
                .first()
            )


            if user:
                email_addresses = data.get("email_addresses", [])
                user.email = (email_addresses[0]["email_address"] if email_addresses else None)
                user.username = data.get("username")
                db.commit()

        elif event_type == "user.deleted":
            user = (db.query(User)
                .filter(User.clerk_id == data["id"])
                .first()
            )

            if user:
                db.delete(user)
                db.commit()

    finally:
        db.close()

    return {"success": True}