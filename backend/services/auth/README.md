# 🔐 Auth & User Microservice

The **Auth Service** manages user authentication, Firebase ID token verification, session initialization in Redis, user profile persistence in MongoDB, and the interview coin wallet balance.

---

## 🔑 Core Features

- **Firebase Admin Authentication:** Validates client-side Firebase ID tokens via `firebase-admin/auth`.
- **Session Management:** Issues cryptographically secure UUID `sessionId` saved in Redis with 7-day TTL (`session:<sessionId>`).
- **Coin Wallet Management:**
  - Default welcome bonus: 100 Interview Coins.
  - `use-coins`: Atomically deducts coins when initiating interviews.
  - `add-coins`: Crediting coins upon payment confirmation.

---

## 📁 Directory Structure

```
auth/
├── configs/
│   ├── db.js                   # Mongoose MongoDB connection
│   └── firebase.js             # Firebase Admin SDK initialization
├── controllers/
│   └── auth.controller.js      # Login, Logout, UseCoins, AddCoins logic
├── model/
│   └── user.model.js           # Mongoose User schema definition
├── routes/
│   └── auth.route.js           # Express route definitions
├── index.js                    # Service entrypoint (Port 6001)
├── serviceAccountKey.json      # Firebase Admin credentials (git-ignored)
└── package.json
```

---

## 🛠️ Endpoints Handled

- `POST /login` — Verify Firebase token, create session cookie.
- `GET /logout` — Invalidate session in Redis, clear cookie.
- `POST /use-coins` — Deduct coins from user balance.
- `POST /add-coins` — Top up user coins.

---

## ⚙️ Environment Configuration

```env
PORT=6001
MONGO_URI=mongodb://localhost:27017/aiagent_auth
REDIS_URL=redis://localhost:6379
```
