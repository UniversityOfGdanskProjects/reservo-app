# Reservo - Zarządzanie rezerwacjami Trójmiasto

Aplikacja webowa do zarządzania rezerwacjami w Trójmieście. Projekt jest napisany w React z wykorzystaniem Vite oraz posiada własne API, które należy uruchomić osobno.

## Technologie

- React + Vite
- Node.js + Express (API)
- SCSS (stylowanie)

## Instalacja i uruchomienie

### 1. Backend (API)

1. Zainstaluj zależności:
   ```sh
   npm install
   ```
2. Uruchom serwer API:
   ```sh
   node src/backend/server.js
   ```
   API powinno być teraz dostępne pod `http://localhost:3000`.

### 2. Frontend (React)

1. Zainstaluj zależności:
   ```sh
   npm install
   ```
2. Uruchom aplikację:
   ```sh
   npm run dev
   ```
   Aplikacja będzie dostępna pod `http://localhost:5173`.

## Wymagania

- Node.js v16+

## Funkcjonalności

- Tworzenie, edytowanie i usuwanie rezerwacji
- Przeglądanie wolnych terminów
- Powiadomienia e-mail o rezerwacjach
- Panel administracyjny

## Autor

Amelia Kanabaj
