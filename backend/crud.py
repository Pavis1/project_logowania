from sqlalchemy.orm import Session
import models
import schemas
import bcrypt


def hash_password(password: str):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()


def verify_password(password: str, hashed: str):
    return bcrypt.checkpw(password.encode(), hashed.encode())


# ==================== GET ====================

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session):
    return db.query(models.User).all()


# ==================== CREATE ====================

def create_user(db: Session, user: schemas.UserCreate):

    new_user = models.User(
        name=user.name,
        surname=user.surname,
        email=user.email,
        role=user.role,
        password_hash=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ==================== UPDATE ====================

def update_user(db: Session, user_id: int, data: schemas.UserUpdate):

    user = get_user(db, user_id)

    if not user:
        return None

    update_data = data.model_dump(exclude_unset=True)

    if "password" in update_data:
        user.password_hash = hash_password(update_data["password"])
        del update_data["password"]

    for key, value in update_data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)

    return user


# ==================== DELETE ====================

def delete_user(db: Session, user_id: int):

    user = get_user(db, user_id)

    if not user:
        return False

    db.delete(user)
    db.commit()

    return True