# 🗺️ TripVault

A full-stack travel memory journal where users can log trips, upload photos and share adventures.
Built for the CodGen Virtual Internship Program (MERN).

**Week 1 status:** Project setup + authentication (register, login, JWT, protected routes).

## Tech Stack
- **Backend:** Node.js, Express, MongoDB Atlas (Mongoose), bcryptjs, jsonwebtoken
- **Frontend:** React (Vite), React Router, Axios

## Project Structure
```
tripvault/
├── client/   # React (Vite) frontend
└── server/   # Express + MongoDB backend
```

## Getting Started

### Prerequisites
- Node.js 18+
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Backend
```bash
cd server
npm install
cp .env.example .env     # then fill in MONGO_URI and JWT_SECRET
npm run dev              # runs on http://localhost:5000
```

### 2. Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev              # runs on http://localhost:5173
```

## API Endpoints

| Method | Endpoint             | Auth | Description                          |
|--------|----------------------|------|--------------------------------------|
| POST   | `/api/auth/register` | No   | Register a user (password hashed)    |
| POST   | `/api/auth/login`    | No   | Login, returns a JWT + user          |
| GET    | `/api/auth/me`       | Yes  | Current user (`Authorization: Bearer <token>`) |

### Example
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Asha","email":"asha@example.com","password":"secret123"}'
```

## Frontend Routes
`/` Home · `/login` · `/register` · `/dashboard` (protected, redirects to `/login` if not authenticated)

## Security Notes
- Passwords are hashed with bcrypt (10 salt rounds), never stored in plain text
- JWTs expire after 7 days and are verified by middleware on protected routes
- `.env` is git-ignored; use `.env.example` as a template
- Login returns the same error for wrong email or wrong password

## Roadmap
- Week 2: Trips CRUD
- Week 3: Photo uploads
- Week 4: Sharing + polish
