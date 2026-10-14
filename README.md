# 🗺️ TripVault

A full-stack travel memory journal where users can log trips, upload photos and share adventures.
Built for the CodGen Virtual Internship Program (MERN).

**Status:**
- Week 1: project setup + authentication (register, login, JWT, protected routes)
- Week 2: trip management (create, view, edit and delete your own trips)

## Features
- Register and log in securely (bcrypt + JWT)
- Create, view, edit and delete trips from the dashboard
- Each user only sees and changes their own trips
- Friendly empty state, loading state, error messages and delete confirmation

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

### Trip routes (all need `Authorization: Bearer <token>`)

| Method | Endpoint          | Description                                  |
|--------|-------------------|----------------------------------------------|
| POST   | `/api/trips`      | Create a trip for the logged-in user         |
| GET    | `/api/trips`      | Get all trips of the logged-in user          |
| GET    | `/api/trips/:id`  | Get one trip (owner only)                    |
| PUT    | `/api/trips/:id`  | Update a trip (owner only)                   |
| DELETE | `/api/trips/:id`  | Delete a trip (owner only)                   |

Trip fields: `title` and `destination` (required), `startDate`, `endDate`, `description`, `rating` (1 to 5), and `user` (set by the server).

Error codes: `400` invalid input, `401` missing or invalid token, `403` trip belongs to another user, `404` trip not found.

### Examplegit
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Asha","email":"asha@example.com","password":"secret123"}'
```

## Frontend Routes
`/` Home · `/login` · `/register` · `/dashboard` (protected: trip list, create, edit and delete)

## Security Notes
- Passwords are hashed with bcrypt (10 salt rounds), never stored in plain text
- JWTs expire after 7 days and are verified by middleware on protected routes
- `.env` is git-ignored; use `.env.example` as a template
- Login returns the same error for wrong email or wrong password
- Every trip route checks the token, and update, delete and single-trip routes check that the trip belongs to the user

## Roadmap
- Week 3: Photo uploads
- Week 4: Sharing + polish
