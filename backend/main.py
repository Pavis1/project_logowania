from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models, schemas, crud
from database import engine, SessionLocal

from auth import get_current_user, require_admin, create_access_token


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "OK"}


@app.post("/api/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):

    db_user = crud.get_user_by_email(db, user.email)

    if not db_user:
        raise HTTPException(status_code=401, detail="Złe dane")

    if not crud.verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Złe dane")

    token = create_access_token({
        "user_id": db_user.id,
        "role": db_user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.get("/api/users")
def get_users(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return crud.get_users(db)


@app.get("/api/users/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    u = crud.get_user(db, user_id)

    if not u:
        raise HTTPException(status_code=404, detail="Nie znaleziono")

    return u


@app.put("/api/users/{user_id}")
def update_user(
    user_id: int,
    data: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    user = crud.get_user(db, user_id)

    if not user:
        raise HTTPException(status_code=404)

    if current_user["role"] != "admin" and current_user["user_id"] != user_id:
        raise HTTPException(status_code=403)

    return crud.update_user(db, user_id, data)


@app.delete("/api/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_admin)
):

    ok = crud.delete_user(db, user_id)

    if not ok:
        raise HTTPException(status_code=404)

    return {"message": "deleted"}