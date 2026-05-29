# ==============================================================================
# PLIK: crud.py (Operacje bazodanowe - Create, Read, Update, Delete)
# OPIS: Mózg operacyjny aplikacji, wykonujący bezpośrednie zapytania SQL do bazy.
# LOGIKA DZIAŁANIA:
# 1. Zawiera funkcje pobierania danych: jednego użytkownika (po ID) lub całej listy.
# 2. Odpowiada za rejestrację: funkcja 'create_user' pobiera czyste hasło, 
#    generuje losową sól (salt) i zamienia je na bezpieczny hash przy użyciu 'bcrypt'.
# 3. Obsługuje edycję danych przez metodę 'model_dump(exclude_unset=True)', 
#    modyfikując w bazie tylko te pola, które użytkownik faktycznie przesłał.
# 4. Bezpiecznie usuwa rekordy z poziomu komendy 'db.delete()'.
# ==============================================================================

from sqlalchemy.orm import Session
import models
import schemas
import bcrypt # używamy czystego bcryptu, bo stary passlib się krzaczy na nowym pythonie

# funkcja pomocnicza - sprawdza czy wpisane hasło pasuje do tego zakodowanego w bazie
def verify_password(plain_password, hashed_password):
    # zmieniamy tekst na bajty, bo bcrypt tylko na nich operuje
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

# funkcja pomocnicza - zamienia czyste hasło na bezpieczny hash (bajty na tekst)
def get_password_hash(password):
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt() # generujemy losową sól dla bezpieczeństwa
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


# ==================== ODCZYT (Read) ====================

# szukamy jednego użytkownika po jego ID
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

# szukamy użytkownika po mailu (potrzebne do logowania i walidacji duplikatów)
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

# wyciągamy listę wszystkich użytkowników (do panelu admina)
def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


# ==================== TWORZENIE (Create) ====================

# dodawanie nowego użytkownika do bazy (rejestracja)
def create_user(db: Session, user: schemas.UserCreate):
    # szyfrujemy hasło zanim trafi do bazy danych
    hashed_pwd = get_password_hash(user.password)
    
    # tworzymy obiekt użytkownika na podstawie modelu SQLAlchemy
    db_user = models.User(
        name=user.name,
        surname=user.surname,
        email=user.email,
        role=user.role,
        password_hash=hashed_pwd # zapisujemy hash, nie czyste hasło!
    )
    
    db.add(db_user)      # wrzucamy do sesji bazy danych
    db.commit()          # zapisujemy zmiany na stałe w pliku .db
    db.refresh(db_user)  # odświeżamy obiekt, żeby dostać jego nowe ID z bazy
    return db_user


# ==================== EDYCJA (Update) ====================

# aktualizacja danych użytkownika
def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
        
    # wyciągamy tylko te pola, które frontend przesłał do zmiany
    update_data = user_update.model_dump(exclude_unset=True)
    
    # jeśli frontend przesłał nowe hasło, musimy je najpierw zhashować
    if "password" in update_data:
        update_data["password_hash"] = get_password_hash(update_data["password"])
        del update_data["password"] # usuwamy czyste hasło z listy zmian
        
    # podmieniamy stare wartości na nowe
    for key, value in update_data.items():
        setattr(db_user, key, value)
        
    db.commit()
    db.refresh(db_user)
    return db_user


# ==================== USUWANIE (Delete) ====================

# wywalanie użytkownika z bazy
def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user) # kasujemy rekord
        db.commit()        # zapisujemy zmianę na dysku
        return True
    return False