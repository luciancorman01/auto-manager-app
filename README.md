# AutoCare Manager 🚗

Aplicație de management flotă auto — React + Express + Prisma + Neon.tech (PostgreSQL)

## Setup rapid

### 1. Configurează baza de date Neon

1. Mergi pe [neon.tech](https://neon.tech) și creează un proiect
2. Copiază **Connection String** (din Dashboard → Connection Details)
3. Creează fișierul `server/.env`:

```bash
cd server
cp .env.example .env
```

Editează `server/.env`:
```
PORT=5000
DATABASE_URL="postgresql://USER:PASS@ep-xxxx.region.aws.neon.tech/dbname?sslmode=require"
JWT_SECRET=un_string_secret_lung_si_random
JWT_EXPIRES_IN=7d
```

### 2. Instalează dependențele

```bash
# Din rădăcina proiectului
npm install

# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 3. Migrează baza de date

```bash
cd server
npx prisma migrate deploy
# sau pentru development:
npx prisma migrate dev --name init
```

### 4. (Opțional) Seed cu date de test

```bash
cd server
npm run db:seed
```

### 5. Pornește aplicația

```bash
# Terminal 1 — backend (port 5000)
cd server && npm run dev

# Terminal 2 — frontend (port 5173)
cd client && npm run dev
```

Deschide: **http://localhost:5173**

---

## Structură proiect

```
auto-manager-app/
├── client/               # React + Vite
│   ├── src/
│   │   ├── api.js        # Axios instance centralizat cu JWT
│   │   ├── Screens/      # Pagini: Login, Register, Dashboard, etc.
│   │   └── components/   # Sidebar
│   └── vite.config.js    # Proxy /api → localhost:5000
│
└── server/               # Express + Prisma
    ├── src/
    │   ├── controllers/  # auth, vehicle, document, service
    │   ├── routes/
    │   └── middleware/   # JWT auth
    └── prisma/
        └── schema.prisma # PostgreSQL schema
```

## API Endpoints

| Method | URL | Auth | Descriere |
|--------|-----|------|-----------|
| POST | /api/auth/register | ❌ | Înregistrare |
| POST | /api/auth/login | ❌ | Login |
| GET | /api/auth/me | ✅ | Profil user |
| PUT | /api/auth/me | ✅ | Update profil |
| GET | /api/vehicles | ✅ | Lista mașini |
| POST | /api/vehicles | ✅ | Adaugă mașină |
| GET | /api/vehicles/:id | ✅ | Detalii mașină |
| PUT | /api/vehicles/:id | ✅ | Editează mașină |
| DELETE | /api/vehicles/:id | ✅ | Șterge mașină |
| GET | /api/vehicles/:id/documents | ✅ | Documente mașină |
| POST | /api/vehicles/:id/documents | ✅ | Adaugă document |
