# AutoCare Manager — Backend API

Backend Node.js + Express pentru aplicația AutoCare Manager. Gestionează autentificarea utilizatorilor, vehiculele, documentele auto și istoricul de service.

---

## 🛠️ Setup & Instalare

### 1. Instalează dependențele

```bash
cd server
npm install
```

### 2. Configurează variabilele de mediu

```bash
cp .env.example .env
```

Editează `.env` și completează:

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/autocare_db"
JWT_SECRET=autocare_super_secret_key_schimba_asta_in_productie
JWT_EXPIRES_IN=7d
```

### 3. Inițializează baza de date

```bash
# Generează clientul Prisma
npm run db:generate

# Rulează migrările
npm run db:migrate

# (Opțional) Populează cu date de test
npm run db:seed
```

### 4. Pornește serverul

```bash
# Development (cu auto-restart)
npm run dev

# Production
npm start
```

---

## 📁 Structura Proiectului

```
server/
├── prisma/
│   ├── schema.prisma      # Schema bazei de date
│   └── seed.js            # Date de test
├── src/
│   ├── config/
│   │   └── prisma.js      # Singleton Prisma Client
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── vehicleController.js
│   │   ├── documentController.js
│   │   └── serviceController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # Verificare JWT
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── vehicleRoutes.js
│   │   ├── documentRoutes.js
│   │   └── serviceRoutes.js
│   └── app.js             # Express app
├── index.js               # Entry point
├── package.json
└── .env.example
```

---

## 🔌 API Endpoints (15 total)

### Auth (`/api/auth`)

| Method | Endpoint | Descriere | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Înregistrare cont nou | ❌ |
| POST | `/api/auth/login` | Login, returnează JWT | ❌ |
| GET | `/api/auth/me` | Datele profilului | ✅ |
| PUT | `/api/auth/me` | Actualizare profil | ✅ |

### Vehicles (`/api/vehicles`)

| Method | Endpoint | Descriere | Auth |
|--------|----------|-----------|------|
| GET | `/api/vehicles` | Lista mașinilor userului | ✅ |
| GET | `/api/vehicles/:id` | Detalii mașină + documente + service | ✅ |
| POST | `/api/vehicles` | Adaugă mașină nouă | ✅ |
| PUT | `/api/vehicles/:id` | Editează mașina | ✅ |
| DELETE | `/api/vehicles/:id` | Șterge mașina | ✅ |

### Documents (`/api/vehicles/:vehicleId/documents`)

| Method | Endpoint | Descriere | Auth |
|--------|----------|-----------|------|
| GET | `/api/vehicles/:vehicleId/documents` | Documente mașinii (cu status alert) | ✅ |
| POST | `/api/vehicles/:vehicleId/documents` | Adaugă document | ✅ |
| GET | `/api/documents/alerts` | Toate documentele ce expiră în 30 zile | ✅ |
| PUT | `/api/documents/:id` | Editează document | ✅ |
| DELETE | `/api/documents/:id` | Șterge document | ✅ |

### Service History

| Method | Endpoint | Descriere | Auth |
|--------|----------|-----------|------|
| GET | `/api/vehicles/:vehicleId/service` | Istoric service mașinii | ✅ |
| GET | `/api/vehicles/:vehicleId/service/stats` | Statistici costuri service | ✅ |
| POST | `/api/vehicles/:vehicleId/service` | Adaugă intrare service | ✅ |
| PUT | `/api/service/:id` | Editează intrare | ✅ |
| DELETE | `/api/service/:id` | Șterge intrare | ✅ |

---

## 📝 Exemple Request/Response

### POST /api/auth/register

**Request:**
```json
{
  "nume_complet": "Ștefan cel Mare",
  "email": "stefan@autocare.ro",
  "parola": "parola123"
}
```

**Response 201:**
```json
{
  "message": "Cont creat cu succes!",
  "user": { "id": 1, "nume_complet": "Ștefan cel Mare", "email": "stefan@autocare.ro" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /api/auth/login

**Request:**
```json
{ "email": "stefan@autocare.ro", "parola": "parola123" }
```

**Response 200:**
```json
{
  "message": "Autentificare reușită!",
  "user": { "id": 1, "email": "stefan@autocare.ro" },
  "token": "eyJ..."
}
```

### POST /api/vehicles

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "marca": "Dacia",
  "model": "Logan",
  "nr_inmatriculare": "B 123 ABC",
  "vin": "RO1DACIA0LOGAN2022",
  "an_fabricatie": 2022
}
```

### POST /api/vehicles/1/documents

**Request:**
```json
{
  "tip": "RCA",
  "data_expirare": "2025-12-31",
  "pret_platit": 850,
  "companie": "Allianz"
}
```

**Response — GET /api/documents/alerts:**
```json
[
  {
    "id": 3,
    "tip": "Rovinieta",
    "data_expirare": "2025-06-01",
    "zile_ramase": 5,
    "status": "yellow",
    "vehicle": { "marca": "Dacia", "model": "Logan", "nr_inmatriculare": "B 123 ABC" }
  }
]
```

### GET /api/vehicles/1/service/stats

**Response:**
```json
{
  "total_cheltuieli": 1250,
  "nr_interventii": 2,
  "cost_mediu": 625,
  "ultimul_km": 120000
}
```

---

## 🔐 Autentificare

Toate rutele marcate cu ✅ necesită header:

```
Authorization: Bearer <JWT_TOKEN>
```

Token-ul se obține la login sau register și este valid 7 zile.

---

## 👥 Contribuții echipă

| Membru | Feature |
|--------|---------|
| - | Auth (register/login/JWT) |
| - | CRUD Vehicles |
| - | CRUD Documents + Alerts |
| - | Service History + Stats |
