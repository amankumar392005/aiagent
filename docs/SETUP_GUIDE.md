# 🚀 Setup & Installation Guide

This guide provides end-to-end instructions for spinning up the local development environment or deploying the **AI Agent** microservices ecosystem.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed on your host system:

- **Node.js:** v18.x or v20.x LTS
- **npm:** v9.x or v10.x
- **Docker Desktop / Docker Engine & Docker Compose:** Latest stable version
- **MongoDB:** Local instance running on `mongodb://localhost:27017` OR a MongoDB Atlas cluster URI
- **Redis:** Running locally via Docker Compose or native installation (`localhost:6379`)
- **Google Gemini API Key:** Active key from [Google AI Studio](https://aistudio.google.com/)
- **Firebase Project:** Firebase web project + Firebase Admin SDK Service Account JSON
- **Razorpay Account (Optional for payments):** Key ID and Key Secret (Test or Live mode)

---

## 🛠️ Step 1: Environment Variables Setup

Each service requires its own `.env` configuration file. Below is the required environment variable matrix across services.

### 1. API Gateway (`backend/gateway/.env`)
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

### 2. Auth Service (`backend/services/auth/.env`)
```env
PORT=6001
MONGO_URI=mongodb://localhost:27017/aiagent_auth
REDIS_URL=redis://localhost:6379
```
> **Note:** Place your downloaded `serviceAccountKey.json` from Firebase inside `backend/services/auth/` directory.

### 3. Resume Service (`backend/services/resume/.env`)
```env
PORT=6002
MONGO_URI=mongodb://localhost:27017/aiagent_resume
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Interview Service (`backend/services/interview/.env`)
```env
PORT=6003
MONGO_URI=mongodb://localhost:27017/aiagent_interview
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key_here
```

### 5. Roadmap Service (`backend/services/roadmap/.env`)
```env
PORT=6004
MONGO_URI=mongodb://localhost:27017/aiagent_roadmap
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key_here
```

### 6. Billing Service (`backend/services/billing/.env`)
```env
PORT=6005
MONGO_URI=mongodb://localhost:27017/aiagent_billing
REDIS_URL=redis://localhost:6379
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 7. Frontend App (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:6000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_app_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

---

## 🐳 Step 2: Start Redis Infrastructure

Run Redis via the root `docker-compose.yml` inside the `backend` folder:

```bash
cd backend
docker-compose up -d
```
Verify Redis is active on port 6379:
```bash
docker ps
```

---

## 📦 Step 3: Install Dependencies

Execute `npm install` across all workspace folders:

```bash
# Frontend
cd frontend
npm install

# API Gateway
cd ../backend/gateway
npm install

# Microservices
cd ../services/auth && npm install
cd ../billing && npm install
cd ../interview && npm install
cd ../resume && npm install
cd ../roadmap && npm install
```

---

## 🏃 Step 4: Run Services in Development Mode

Open separate terminal windows or use process managers (e.g. `concurrently` / `pm2`):

```bash
# Terminal 1: Auth Service
cd backend/services/auth && npm run dev

# Terminal 2: Resume Service
cd backend/services/resume && npm run dev

# Terminal 3: Interview Service
cd backend/services/interview && npm run dev

# Terminal 4: Roadmap Service
cd backend/services/roadmap && npm run dev

# Terminal 5: Billing Service
cd backend/services/billing && npm run dev

# Terminal 6: API Gateway
cd backend/gateway && npm run dev

# Terminal 7: Frontend Application
cd frontend && npm run dev
```

Access the frontend web application at: `http://localhost:5173`.

---

## 🚢 Docker Production Deployment (Per Service)

Every microservice includes a standalone `Dockerfile`. To build and containerize a service (e.g. Gateway):

```bash
cd backend/gateway
docker build -t aiagent-gateway:1.0 .
docker run -p 6000:6000 --env-file .env aiagent-gateway:1.0
```
