# ==============================================================================
# PLIK: database.py (Konfiguracja i połączenie z bazą danych)
# OPIS: Odpowiada za techniczne serce komunikacji aplikacji z bazą SQLite.
# LOGIKA DZIAŁANIA:
# 1. Tworzy lokalny plik bazy danych o nazwie 'projekt.db'.
# 2. Konfiguruje tzw. 'engine' (silnik), który zarządza połączeniami SQL.
# 3. Tworzy 'SessionLocal' - klasę fabryczną, która otwiera niezależne sesje 
#    (furtki do bazy) dla każdego zapytania CRUD.
# 4. Definiuje obiekt 'Base' - klasę bazową (ORM), po której będą dziedziczyć 
#    wszystkie nasze modele tabel, aby SQLAlchemy wiedziało, jak je mapować.
# ==============================================================================

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Definicja gdzie ma powstać plik naszej bazy danych
SQLALCHEMY_DATABASE_URL = "sqlite:///./projekt.db"

# 2.  silnik (engine), który zarządza połączeniem z plikiem SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}  
)

# 3. Fabryka sesji. Każde zapytanie do bazy np. logowanie będzie osobną sesją
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Klasa bazowa, po której będą dziedziczyć nasze modele
Base = declarative_base()

