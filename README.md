# project_logowania

==============================================================================
INSTRUKCJA DLA FRONTENDU - JAK URUCHOMIĆ I PODPIĄĆ BACKEND
==============================================================================

Cześć! Zrobiłem nasz backend. Wszystko działa na bazie SQLite (czyli cała baza 
danych to jeden plik na dysku) oraz FastAPI. 

Włączyłem też tzw. CORS. Co to znaczy dla Ciebie? To znaczy, że Twój kod w 
JavaScript (np. przez fetch) będzie mógł bez problemu pobierać dane z mojego 
serwera, a przeglądarka internetowa nie zablokuje połączenia.

------------------------------------------------------------------------------
1. JAK ODPALIĆ TEN BACKEND NA TWOIM KOMPUTERZE (KROK PO KROKU)
------------------------------------------------------------------------------

Musisz mieć zainstalowanego Pythona. Otwórz terminal (konsolę) w folderze 
całego projektu i wpisz po kolei te komendy:

Krok A: Wejdź do folderu z backendem:
cd backend

Krok B: Stwórz wirtualne środowisko (taki odizolowany folder na programy):
python -m venv venv

Krok C: Włącz to środowisko (musisz to zrobić przed instalacją i startem):
- Jeśli masz Windowsa (PowerShell):  .\venv\Scripts\Activate.ps1
- Jeśli masz Maca lub Linuksa:       source venv/bin/activate
(Po tym kroku na początku linijki w terminalu pojawi się napis (venv))

Krok D: Zainstaluj wszystkie potrzebne pakiety jednym ruchem:
pip install -r requirements.txt

Krok E: Uruchom serwer, żeby działał w tle:
uvicorn main:app --reload

Od teraz Twój serwer żyje pod adresem: http://127.0.0.1:8000
Ważne: Nie zamykaj tego okna terminala podczas pisania frontendu!

------------------------------------------------------------------------------
2. JAK SPRAWDZIĆ CZY TO DZIAŁA (PANEL TESTOWY)
------------------------------------------------------------------------------

Włącz przeglądarkę i wejdź pod adres: http://127.0.0.1:8000/docs
Otworzy Ci się genialna strona (Swagger UI). Masz tam listę wszystkich moich 
funkcji. Możesz kliknąć np. w zakładkę dodawania użytkownika, wybrać 
"Try it out", wpisać jakieś dane i kliknąć "Execute" – w ten sposób dodasz 
człowieka do bazy bez pisania kodu na stronie!

------------------------------------------------------------------------------
3. ŚCIĄGAWKA DLA CIEBIE (POD JAKIE LINKI MASZ WYSYŁAĆ DANE ZE STRONY)
------------------------------------------------------------------------------

Wszystkie zapytania na stronie (np. przez fetch) wysyłasz pod adres główny:
http://127.0.0.1:8000

Oto lista linków (endpointów), które dla Ciebie przygotowałem:

A. POBIERANIE LISTY UŻYTKOWNIKÓW (np. do tabelki na stronie)
   - Typ zapytania: GET
   - Adres: http://127.0.0.1:8000/api/users
   - Co wraca: Lista wszystkich ludzi w bazie. Hasła są automatycznie ukryte!

B. REJESTRACJA (dodawanie nowego konta z formularza)
   - Typ zapytania: POST
   - Adres: http://127.0.0.1:8000/api/users
   - Co musisz mi wysłać (w formacie JSON):
     {
       "name": "Imię",
       "surname": "Nazwisko",
       "email": "mail@test.pl",
       "password": "haslo_w_czystym_tekscie",
       "role": "użytkownik"
     }
   - Uwaga: Jeśli wyślesz maila, który już istnieje w bazie, serwer zwróci błąd 400.

C. LOGOWANIE (sprawdzanie hasła)
   - Typ zapytania: POST
   - Adres: http://127.0.0.1:8000/api/login
   - Co musisz mi wysłać (w formacie JSON):
     {
       "email": "mail@test.pl",
       "password": "haslo_wpisane_w_okienku"
     }
   - Co wraca: Jeśli dane są poprawne, serwer odpisze, że sukces i da dane użytkownika.
     Jeśli hasło albo mail będą złe – serwer odpowie błędem 401 (Nieautoryzowany).

D. EDYCJA DANYCH (np. zmiana imienia w profilu)
   - Typ zapytania: PUT
   - Adres: http://127.0.0.1:8000/api/users/TUTAJ_ID_USERA (np. /api/users/1)
   - Uwaga: Wszystkie pola są opcjonalne. Jeśli użytkownik zmienia tylko imię, 
     wysyłasz mi w JSONIE samo imię, a reszta danych w bazie zostanie nietknięta.

E. USUWANIE UŻYTKOWNIKA
   - Typ zapytania: DELETE
   - Adres: http://127.0.0.1:8000/api/users/TUTAJ_ID_USERA (np. /api/users/1)

------------------------------------------------------------------------------
4. PARĘ SŁÓW O BEZPIECZEŃSTWIE (ŻEBYŚMY WIEDZIELI CO MÓWIĆ NA OBRONIE)
------------------------------------------------------------------------------
- Ty wysyłasz mi hasło w czystym tekście. Ja je natychmiast przechwytuję, 
  mieszam specjalnym algorytmem (bcrypt) i w bazie zapisuję jako totalnie 
  losowy ciąg znaków (hash). Nie da się go odkodować.
- Gdy użytkownik się loguje, bcrypt porównuje wpisane hasło z tym zakodowanym.
- Cała baza to plik "projekt.db". Jak coś popsujesz w testach, skasuj ten plik. 
  Mój kod przy następnym starcie stworzy nową, idealnie czystą bazę danych.