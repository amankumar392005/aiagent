# 🚪 API Gateway Microservice

The **API Gateway** acts as the single entrypoint for all frontend traffic. It handles cross-origin resource sharing (CORS), session validation, route proxying, and header injection.

---

## ⚡ Architecture & Responsibilities

1. **Request Interception:** Captures all incoming `/api/*` traffic from the client application.
2. **Session Verification (`isAuth` Middleware):** Reads `session` cookie, verifies key against Redis (`session:<sessionId>`), and rejects unauthorized requests with `401 Unauthorized`.
3. **Identity Injection (`proxyWithHeaders`):** Decorates downstream HTTP proxy requests with `x-user-id: <mongo_user_id>` so target microservices can execute without duplicate token checks.
4. **CORS & Cookie Management:** Handles credentialed cross-origin requests (`credentials: true`) and cookie header forwarding.

---

## 📍 Proxy Routing Map

| Gateway Endpoint | Protection | Target Microservice | Target URL |
| :--- | :--- | :--- | :--- |
| `POST /api/auth/*` | Public | Auth Service | `process.env.AUTH_SERVICE_URL` |
| `GET /api/me` | `isAuth` | Gateway Controller | Internal Handler |
| `ALL /api/resume/*` | `isAuth` | Resume Service | `process.env.RESUME_SERVICE_URL` |
| `ALL /api/interview/*` | `isAuth` | Interview Service | `process.env.INTERVIEW_SERVICE_URL` |
| `ALL /api/roadmap/*` | `isAuth` | Roadmap Service | `process.env.ROADMAP_SERVICE_URL` |
| `ALL /api/billing/*` | `isAuth` | Billing Service | `process.env.BILLING_SERVICE_URL` |

---

## ⚙️ Environment Configuration

```env
PORT=6000
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
AUTH_SERVICE_URL=http://localhost:6001
RESUME_SERVICE_URL=http://localhost:6002
INTERVIEW_SERVICE_URL=http://localhost:6003
ROADMAP_SERVICE_URL=http://localhost:6004
BILLING_SERVICE_URL=http://localhost:6005
```

---

## 🏃 Running the Gateway

```bash
npm install
npm run dev # Launches nodemon on Port 6000
```
