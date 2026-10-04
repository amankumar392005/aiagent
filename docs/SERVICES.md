# ⚙️ Microservices Technical Reference

This document provides a deep technical inspection of every microservice in the platform, including routing policies, agent topologies, controllers, and shared utilities.

---

## 1. Gateway Microservice (`backend/gateway`)

- **Role:** Central Reverse Proxy and Single Entrypoint.
- **Port:** `6000`
- **Key Modules:**
  - `index.js`: Express server setup, CORS configuration (`credentials: true`), route mounting.
  - `middleware/isAuth.js`: Evaluates `req.cookies.session` against Redis `session:<sessionId>`.
  - `utils/proxyWithHeaders.js`: High-order wrapper over `express-http-proxy`. Automatically appends `x-user-id` header to downstream requests.
  - `controllers/user.controller.js`: Exposes `/api/me` endpoint to return sanitized user profile.

---

## 2. Authentication Microservice (`backend/services/auth`)

- **Role:** User Onboarding, Firebase ID Token Verification, Session Lifecycle & Coin Ledger.
- **Port:** `6001`
- **Database:** MongoDB (`User` collection) & Redis.
- **Key Files:**
  - `configs/firebase.js`: Initializes `firebase-admin` with `serviceAccountKey.json`.
  - `controllers/auth.controller.js`:
    - `login`: Decodes Firebase ID Token, upserts User, issues session UUID to Redis (`EX 604800` s), sets `session` cookie.
    - `logout`: Deletes session from Redis and clears cookie.
    - `useInterviewCoins`: Validates wallet balance, deducts specified coins, updates MongoDB and Redis session state atomically.
    - `addCoins`: Increases user coin balance following successful payment verification.

---

## 3. Resume Microservice (`backend/services/resume`)

- **Role:** PDF Parsing, ATS Resume Analysis, Skill Gap Matrix & Recommendations.
- **Port:** `6002`
- **Database:** MongoDB (`Resume` collection) & Redis (`resume:<userId>`).
- **Key Files:**
  - `config/pdf.js`: Extractor utility parsing PDF files to plain text.
  - `agents/resume.agent.js`: Invokes `@langchain/google-genai` (Gemini model) with structured JSON prompt instructions.
  - `controllers/resume.controller.js`: Handles multipart PDF uploads via Multer, runs extraction & AI analysis, stores results in MongoDB & Redis cache, cleans up temp files (`fs.unlinkSync`).

---

## 4. Interview Microservice (`backend/services/interview`)

- **Role:** Interactive Technical & HR Mock Interview State Engine.
- **Port:** `6003`
- **Database:** MongoDB (`Interview` collection).
- **Key Files:**
  - `agents/interview.agent.js`: Dynamically builds technical or HR question prompts.
  - `agents/feedback.agent.js`: Evaluates individual candidate answers against expected criteria.
  - `agents/summary.agent.js`: Evaluates complete interview trajectory and generates overall score & feedback.
  - `graph/graph.js`: State machine compiled via `@langchain/langgraph` linking `interviewNode`, `feedbackNode`, and `summaryNode` via conditional router functions.
  - `controllers/interview.controller.js`: Coordinates state graph execution, session tracking, and reporting.

---

## 5. Roadmap Microservice (`backend/services/roadmap`)

- **Role:** AI-Generated Career Roadmaps & Learning Resource Recommendation.
- **Port:** `6004`
- **Database:** MongoDB (`Roadmap` collection) & Redis (`userRoadmaps:<userId>`, `roadmap:<id>`).
- **Key Files:**
  - `agents/roadmap.agent.js`: Generates structured multi-phase learning paths based on target role, salary package, and user resume.
  - `agents/resource.agent.js`: Enriches roadmap subtopics with curated online courses and documentation links.
  - `graph/roadmap.graph.js`: LangGraph pipeline orchestrating step generation followed by resource enrichment.
  - `controllers/roadmap.controller.js`: Serves roadmap creation, user list fetching, and single roadmap fetching with Redis caching.

---

## 6. Billing Microservice (`backend/services/billing`)

- **Role:** Coin Package Orders & Razorpay Payment Verification.
- **Port:** `6005`
- **Database:** MongoDB (`Billing` collection).
- **Key Files:**
  - `configs/razorpay.js`: Instantiates Razorpay Node.js SDK with API key & secret.
  - `controllers/billing.controller.js`:
    - `createOrder`: Creates Razorpay order object for coin plan, records billing document (`status: "created"`).
    - `verifyPayment`: Computes HMAC SHA-256 signature (`${razorpay_order_id}|${razorpay_payment_id}`) with `RAZORPAY_KEY_SECRET`. On match, updates billing document to `status: "paid"`.

---

## 7. Shared Modules (`backend/shared`)

- **`shared/redis/redis.js`**: Exported `ioredis` Client Singleton connecting to `process.env.REDIS_URL || "redis://localhost:6379"`. Used across all microservices for unified session and cache access.
