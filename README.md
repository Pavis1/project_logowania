# System Zarządzania Użytkownikami (CRUD)

Projekt końcoworoczny realizujący aplikację do zarządzania użytkownikami. Aplikacja została wykonana w architekturze rozdzielonej (odseparowany backend oraz frontend) i komunikuje się za pomocą protokołu HTTP poprzez REST API.

## Specyfikacja technologiczna

* **Backend:** Python 3.x, FastAPI, SQLAlchemy, Pydantic, bcrypt (haszowanie haseł)
* **Baza danych:** SQLite (plikowa baza danych zintegrowana z projektem)
* **Frontend:** HTML5, CSS3, JavaScript (Natywne Fetch API, brak przeładowania strony - Dynamic DOM Object)
* **Testy:** Node.js, Jest.js, Selenium WebDriver

## Funkcjonalności systemu

* Pełny zestaw operacji CRUD (Tworzenie, Odczyt, Aktualizacja, Usuwanie użytkowników).
* System uwierzytelniania oparty na tokenach (autoryzacja przy każdorazowym zapytaniu).
* Podział uprawnień na role: Administrator (pełny dostęp) oraz Użytkownik (ograniczony dostęp do modyfikacji danych).
* Pełna walidacja danych (poprawność formatu e-mail, blokada duplikacji adresów w bazie danych) realizowana zarówno po stronie klienta, jak i serwera.

---

## Instrukcja uruchomienia projektu

Poniższa instrukcja pozwala na pełne uruchomienie środowiska testowego, serwera API oraz warstwy prezentacji.

### Krok 1: Uruchomienie warstwy backendowej (Python / FastAPI)
Aplikacja wykorzystuje bazę danych SQLite. Nie jest wymagana instalacja zewnętrznych serwerów bazodanowych (takich jak MySQL czy XAMPP). Plik bazy danych zostanie automatycznie zainicjalizowany i utworzony przy pierwszym uruchomieniu serwera.

1. Otwórz terminal w folderze zawierającym pliki backendu. (cd backend)
2. Zainstaluj wymagane pakiety środowiskowe za pomocą menedżera pakietów pip:
   ```bash
   pip install -r requirements.txt
   ```
3. Uruchom serwer produkcyjny Uvicorn:
   ```bash
   uvicorn main:app --reload
   ```
   (Serwer będzie uruchamiany na adresie http://127.0.0.1:8000)

### Krok 2: Uruchomienie warstwy frontendowej (JavaScript / Node.js)

Aplikacja wykorzystuje bibliotekę Selenium WebDriver do testowania interakcji z interfejsem użytkownika.
1. Otwórz terminal w folderze zawierającym pliki frontendu. (cd frontend)
2. Uruchom plik index.html w przeglądarce za pomocą lokalnego serwera statycznego (np. Live Server w VS Code) 
3. Aplikacja kliencka domyślnie otworzy się pod adresem http://127.0.0.1:5500/frontend/index.html

### Krok 3: Przegląd dokumentacji API (Swagger UI)

Framework FastAPI umożliwia automatyczne generowanie dokumentacji API, ze specyfikacją OpenAPI (Swagger).
1. Upewnij się, że serwer backend jest uruchomiony (krok 1)
2. Otwórz przeglądarkę i przejdź do adresu http://127.0.0.1:8000/docs
3. Interfejs umożliwia weryfikację struktury requestów, dopuszczalnych formatów JSON oraz testowanie działania API bezpośrednio z poziomu przeglądarki.

### Krok 4: Uruchomienie testów automatycznych

Projekt zawiera zestaw 15 testów automatycznych (jednostkowych oraz integracyjnych E2E przy użyciu Selenium), które weryfikują poprawność działania CRUD oraz politykę uprawnień ról.
1. Upewnij się, że posiadasz zainstalowane Node.js (https://nodejs.org/en/download/)
2. Otwórz drugi terminal w folderze zawierającym pliki frontendu. (cd frontend)
3. Zainstaluj wymagane pakiety środowiskowe za pomocą menedżera pakietów npm:
   ```bash
   npm install
   ```
4. Uruchom testy automatyczne:
   ```bash
   npm test
   ```

### Zalecane narzędzia opcjonalne

1. SQLiteViewer (Rozszerzenie VS Code): Pozwala na bezpośrednie przeglądanie zawartości pliku bazy danych z rozszerzeniem .db lub .sqlite wewnątrz edytora Visual Studio Code, bez konieczności uruchamiania zewnętrznych programów.
2. DB Browser For SQLite: Darmowy, zewnętrzny program desktopowy przeznaczony do zaawansowanego projektowania, edycji oraz przeglądania baz SQLite. Umożliwia wygodne filtrowanie danych oraz ręczne modyfikowanie rekordów w celach testowych.