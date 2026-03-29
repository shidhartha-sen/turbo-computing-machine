# Flipurt - Student Marketplace

A mobile marketplace app for students to buy and sell items, built with React Native (Expo) and FastAPI.

---

## Prerequisites

- **Node.js** v18+ and **npm**
- **Python** 3.11+
- **Expo Go** app on your phone (or an Android/iOS emulator)
- Access to a PostgreSQL database (e.g. Neon)

---

## Project Structure

```
cmpt370/
├── backend/     # FastAPI Python backend
└── frontend/    # React Native Expo app
```

---

## Backend Setup

### 1. Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure environment variables

Create a `backend/.env` file:

```env
DATABASE_URL=postgresql+psycopg2://<user>:<password>@<host>/<database>
JWT_SECRET=<your-secret-key>
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=10080

# Optional — SMTP for email OTP
SMTP_HOST=
SMTP_PORT=465
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
```

### 3. Set up the database

Run the SQL schema against your PostgreSQL database:

```bash
psql $DATABASE_URL -f db/database.sql
```

### 4. Start the backend server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.
Interactive docs: `http://localhost:8000/docs`

---

## Frontend Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment variables

Create a `frontend/.env.local` file:

```env
EXPO_PUBLIC_API_URL=http://<your-machine-ip>:8000
EXPO_PUBLIC_MS_CLIENT_ID=<microsoft-app-client-id>
EXPO_PUBLIC_MS_TENANT_ID=common
```

> **Note:** Use your machine's local IP address (not `localhost`) so that your phone or emulator can reach the backend. Find your IP with `ip addr` on Linux or `ifconfig` on Mac.

### 3. Start the Expo development server

```bash
cd frontend
npx expo start
```

Then choose how to run the app:

| Key | Action |
|-----|--------|
| `a` | Open in Android emulator |
| `i` | Open in iOS simulator |
| `w` | Open in web browser |
| Scan QR | Open in **Expo Go** on your phone |

---

## Running with Docker (Backend only)

```bash
docker build -t cmpt370-backend backend/
docker run --env-file backend/.env -p 8000:8000 cmpt370-backend
```

---

## Microsoft OAuth Setup

To enable Microsoft login:

1. Register an app in the [Azure Portal](https://portal.azure.com) under **App registrations**
2. Add a redirect URI: `exp://localhost:8081` (for Expo Go) or your app's custom scheme
3. Copy the **Application (client) ID** and **Tenant ID** into `frontend/.env.local`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native, Expo, TypeScript, NativeWind (Tailwind) |
| Backend | FastAPI, SQLAlchemy, Uvicorn |
| Database | PostgreSQL (Neon serverless) |
| Auth | Microsoft OAuth + JWT |
| Routing | Expo Router (file-based) |
