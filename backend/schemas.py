# ==============================================================================
# PLIK: schemas.py (Schematy Pydantic - Walidacja danych i kontrakt API)
# OPIS: Działa jako "strażnik graniczny" sprawdzający strukturę danych z przeglądarki.
# LOGIKA DZIAŁANIA:
# 1. Rozdziela logikę bazy danych (modele) od danych przesyłanych przez sieć (schematy).
# 2. 'UserCreate' - waliduje dane podczas rejestracji (wymaga podania jawnego hasła).
# 3. 'UserUpdate' - waliduje dane podczas edycji (wszystkie pola są jako Optional).
# 4. 'UserResponse' - określa, co serwer odsyła do frontendu. Ze względów 
#    bezpieczeństwa całkowicie wycina pole hasła, dbając o prywatność danych.
# ==============================================================================

from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# 1. Wspólne pola dla użytkownika (używane przy odczycie i zapisie)
class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    surname: str = Field(..., min_length=2, max_length=50)
    email: EmailStr # Automatycznie waliduje poprawność formatu (musi mieć @ i domenę)
    role: str = "użytkownik" # Domyślna rola

# 2. Schemat używany PODCZAS REJESTRACJI / DODAWANIA użytkownika
class UserCreate(UserBase):
    password: str = Field(..., min_length=4) # Hasło w czystym tekście z frontendu (min. 4 znaki)

# 3. Schemat używany PODCZAS EDYCJI (wszystkie pola są opcjonalne)
class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    surname: Optional[str] = Field(None, min_length=2, max_length=50)
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    password: Optional[str] = Field(None, min_length=4)

# 4. Schemat używany do WYSYŁANIA danych na frontend (odpowiedź serwera)
class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True # Pozwala Pydanticowi współpracować z modelami SQLAlchemy