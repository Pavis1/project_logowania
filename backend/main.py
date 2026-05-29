# ==============================================================================
# PLIK: main.py (Punkt startowy aplikacji - Spoiwo całego projektu)
# OPIS: Centrum dowodzenia FastAPI, które konfiguruje serwer i wystawia adresy URL.
# LOGIKA DZIAŁANIA:
# 1. Inicjalizuje aplikację FastAPI i wymusza automatyczne utworzenie pliku bazy 
#    danych 'projekt.db' przy starcie, jeśli plik został wcześniej usunięty.
# 2. Konfiguruje 'CORS Middleware' - kluczowy mechanizm bezpieczeństwa, który 
#    zezwala zewnętrznemu frontendowi (np. na porcie 5500) pobierać dane z API.
# 3. Definiuje endpointy (ścieżki sieciowe) takie jak /api/users oraz /api/login.
# 4. Automatycznie generuje interaktywną dokumentację Swagger UI pod adresem /docs.
# ==============================================================================

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
import schemas
import crud
from database import engine, SessionLocal

# tworzymy tabele w bazie danych jeśli jeszcze nie istnieją
models.Base.metadata.create_all(bind=engine)

# odpalamy całe fastapi
app = FastAPI(title="Panel Zarządzania Użytkownikami - API")

# konfiguracja CORS, żeby frontend mógł pogadać z backendem (bardzo ważne!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # pozwalamy na żądania z dowolnego adresu (wygodne do testów)
    allow_credentials=True,
    allow_methods=["*"], # pozwalamy na wszystkie metody: GET, POST, PUT, DELETE
    allow_headers=["*"], # pozwalamy na dowolne nagłówki
)

# funkcja pomocnicza, która otwiera sesję bazy dla każdego zapytania i zamyka ją po skończeniu
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==================== ENDPOINTY API (CRUD) ====================

# STRONA GŁÓWNA - żeby nie pokazywało pustego błędu 404
@app.get("/")
def root():
    return {"status": "Serwer działa poprawnie. Dokumentacja API jest pod adresem /docs"}

# 1. DODAWANIE UŻYTKOWNIKA (Create / Rejestracja)
@app.post("/api/users", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # sprawdzamy czy taki mail już jest w bazie (spełniamy warunek walidacji!)
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Ten adres e-mail jest już zajęty.")
    return crud.create_user(db=db, user=user)


# 2. POBIERANIE WSZYSTKICH UŻYTKOWNIKÓW (Read - lista)
@app.get("/api/users", response_model=list[schemas.UserResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


# 3. POBIERANIE JEDNEGO UŻYTKOWNIKA (Read - szczegóły)
@app.get("/api/users/{user_id}", response_model=schemas.UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Użytkownik nie istnieje.")
    return db_user


# 4. EDYCJA UŻYTKOWNIKA (Update)
@app.put("/api/users/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    # sprawdzamy najpierw czy użytkownik w ogóle istnieje w bazie
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Nie znaleziono użytkownika do edycji.")
    
    # jeśli użytkownik zmienia maila, sprawdzamy czy nowy mail nie jest już zajęty przez kogoś innego
    if user_update.email and user_update.email != db_user.email:
        email_check = crud.get_user_by_email(db, email=user_update.email)
        if email_check:
            raise HTTPException(status_code=400, detail="Ten nowy e-mail jest już zajęty.")
            
    return crud.update_user(db=db, user_id=user_id, user_update=user_update)


# 5. USUWANIE UŻYTKOWNIKA (Delete)
@app.delete("/api/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    success = crud.delete_user(db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Nie można usunąć. Użytkownik nie istnieje.")
    return {"message": f"Użytkownik o ID {user_id} został pomyślnie usunięty."}


# 6. PROSTE LOGOWANIE (Dodatkowa funkcja na lepszą ocenę)
@app.post("/api/login")
def login(user_credentials: schemas.UserCreate, db: Session = Depends(get_db)): # używamy UserCreate dla uproszczenia (mail i password)
    db_user = crud.get_user_by_email(db, email=user_credentials.email)
    if not db_user or not crud.verify_password(user_credentials.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Niepoprawny e-mail lub hasło.")
    
    return {
        "message": "Zalogowano pomyślnie!",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "surname": db_user.surname,
            "email": db_user.email,
            "role": db_user.role
        }
    }

