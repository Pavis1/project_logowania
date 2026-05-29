# ==============================================================================
# PLIK: models.py (Modele bazodanowe - Struktura tabel SQL)
# OPIS: Definiuje fizyczny wygląd i relacje danych zapisywanych na dysku komputera.
# LOGIKA DZIAŁANIA:
# 1. Klasa 'User' dziedziczy po obiekcie 'Base' (z database.py), tworząc mapowanie.
# 2. Deklaruje, że w bazie powstanie prawdziwą tabela SQL o nazwie "users".
# 3. Definiuje konkretne kolumny: id (klucz główny), name, surname, email oraz role.
# 4. BEZPIECZEŃSTWO: Zamiast czystego hasła, tworzy kolumnę 'password_hash'. 
#    W bazie danych nigdy nie przechowujemy jawnych haseł użytkowników!
# ==============================================================================

from sqlalchemy import Column, Integer, String
from database import Base

# Klasa User, która w bazie danych stanie się tabelą o nazwie "users"
class User(Base):
    __tablename__ = "users"

    # Kkolumny tabeli
    id = Column(Integer, primary_key=True, index=True)  # Unikalny numer ID (nadawany automatycznie)
    name = Column(String, nullable=False)               # Imię (pole nie może być puste)
    surname = Column(String, nullable=False)            # Nazwisko (pole nie może być puste)
    email = Column(String, unique=True, index=True, nullable=False) # Email (musi być unikalny w skali bazy!)
    password_hash = Column(String, nullable=False)     # Zahashowane hasło (bezpieczeństwo!)
    role = Column(String, default="użytkownik")         # Rola: np. użytkownik, administrator