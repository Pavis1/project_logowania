from jose import jwt, JWTError
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from dotenv import load_dotenv
import os

load_dotenv()

security = HTTPBearer()

SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")


def get_current_user(credentials=Depends(security)):

    token = credentials.credentials

    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id = data.get("user_id")
        role = data.get("role", "user")

        if not user_id:
            raise HTTPException(status_code=401, detail="Bad token")

        return {
            "user_id": user_id,
            "role": role
        }

    except JWTError:
        raise HTTPException(status_code=401, detail="Token error")


def require_admin(user=Depends(get_current_user)):

    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

    return user


def create_access_token(data: dict):

    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)