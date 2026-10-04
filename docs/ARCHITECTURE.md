# 🏗️ System Architecture & Engineering Design

This document details the architectural principles, system topology, service interaction patterns, data models, state machines, and session mechanics of the **AI Agent Career Platform**.

---

## 1. High-Level System Architecture

The platform follows a **Decoupled Microservices Architecture** fronted by a unified **API Gateway**, utilizing **Redis** for stateful session persistence and cache acceleration, **MongoDB** for document storage, and **LangChain / LangGraph** for multi-agent AI workflows.

```
                     +---------------------------------+
                     |   Client Application (React 19) |
                     +---------------------------------+
                                      |
                                 HTTP / CORS
                                      v
                    +-----------------------------------+
                    |     API Gateway (Port 6000)       |
                    |  - Express Proxy                  |
                    |  - Redis Session Verification     |
                    |  - Header Injection (x-user-id)   |
                    +-----------------------------------+
                                      |
       +------------------+-----------+-----------+------------------+
       |                  |                       |                  |
       v                  v                       v                  v
+--------------+   +--------------+        +--------------+   +--------------+
| Auth Service |   |Resume Service|        |Interview Svc |   |Roadmap Svc   |
| (Port 6001)  |   | (Port 6002)  |        | (Port 6003)  |   | (Port 6004)  |
+--------------+   +--------------+        +--------------+   +--------------+
       |                  |                       |                  |
       |                  +--------+     +--------+                  |
       |                           |     |                           |
       v                           v     v                           v
+--------------+               +------------------+           +--------------+
| Billing Svc  |               |  LangChain /     |           | Google       |
| (Port 6005)  |               |  LangGraph AI    |           | Gemini API   |
+--------------+               +------------------+           +--------------+
       |                                  |                          |
       +-----------------+----------------+--------------------------+
                         |
                         v
              +---------------------+
              | Redis Session Cache |
              |  & MongoDB Clusters |
              +---------------------+
```

---

## 2. API Gateway & Session Auth Pattern

### Gateway Proxy & Authentication Flow

1. **Authentication Request:** Client signs in using Firebase Client SDK on Frontend and receives a Firebase ID token.
2. **Login Dispatch:** Frontend posts token to `/api/auth/login`.
3. **Session Creation:** Auth service verifies ID token via `firebase-admin`, creates/retrieves user record in MongoDB, generates a UUID `sessionId`, and writes the session state into Redis with a 7-day TTL (`session:<sessionId>`).
4. **Cookie Setting:** HttpOnly, Secure, `sameSite: none` cookie `session=<sessionId>` is issued to the browser.
5. **Gateway Routing:**
   - Public endpoint `/api/auth` is proxied directly.
   - Protected endpoints (`/api/resume`, `/api/interview`, `/api/roadmap`, `/api/billing`) pass through `isAuth` middleware.
   - `isAuth` inspects `req.cookies.session`, retrieves and validates session JSON from Redis.
   - `proxyWithHeaders` injects `x-user-id: <mongo_user_id>` into downstream proxy request headers.

```
Client             API Gateway            Redis          Auth Service        MongoDB
  |                     |                   |                 |                 |
  |--- POST /login ---->|------------------------------------>|                 |
  |    {token}          |                   |                 |-- Verify Token->|
  |                     |                   |                 |<- User Record --|
  |                     |                   |<- Set Session --|                 |
  |                     |                   |   session:UUID  |                 |
  |<-- Set Cookie ------|<------------------------------------|                 |
  |    session=UUID     |                   |                 |                 |
  |                     |                   |                 |                 |
  |--- GET /api/resume->|                   |                 |                 |
  |    (with cookie)    |-- Get Session --->|                 |                 |
  |                     |<- Session Valid --|                 |                 |
  |                     |-- Proxy + x-user-id Header -------->| (Resume Svc)    |
```

---

## 3. LangGraph AI Agent State Machine

The **Interview Microservice** utilizes `@langchain/langgraph` to execute structured, multi-turn AI interviews using a conditional state graph engine.

### Interview Graph Definition

```
        +-------+
        | START |
        +-------+
            |
            v
     [ Action Router ]
       /          \
  (start)       (feedback)
     /              \
    v                v
+----------------+  +-----------------+
| interviewNode  |  |  feedbackNode   |
+----------------+  +-----------------+
        |                    |
        v            [ Feedback Router ]
      +---+            /           \
      |END|       (completed)   (ongoing)
      +---+           /               \
                     v                 v
             +--------------+        +---+
             | summaryNode  |        |END|
             +--------------+        +---+
                     |
                     v
                   +---+
                   |END|
                   +---+
```

### State Schema (`InterviewState`)

- `type`: String ("hr" | "technical")
- `role`: Target job role
- `experience`: Target experience level
- `questionCount`: Total interview question count
- `questions`: Array of generated questions
- `answers`: User-submitted answer trajectory
- `feedbacks`: Per-question AI evaluation & score
- `summary`: Overall AI performance evaluation & final verdict
- `action`: Routing action ("start" | "feedback")
- `completed`: Boolean indicating if session reached final question

---

## 4. Database Data Models (MongoDB Schemas)

### User Model (`auth` service)
```javascript
{
  firebaseUid: { type: String, required: true, unique: true },
  email:       { type: String, required: true, unique: true },
  name:        { type: String, required: true },
  interviewCoin: { type: Number, default: 100 },
  createdAt:   { type: Date, default: Date.now }
}
```

### Resume Model (`resume` service)
```javascript
{
  userId:          { type: String, required: true, unique: true },
  extractedText:   { type: String, required: true },
  score:           { type: Number },
  skills:          [ String ],
  missingSkills:   [ String ],
  recommendations: [ String ],
  summary:         { type: String },
  createdAt:       { type: Date, default: Date.now }
}
```

### Interview Model (`interview` service)
```javascript
{
  userId:        { type: String, required: true },
  type:          { type: String, enum: ["hr", "technical"], required: true },
  role:          { type: String, required: true },
  experience:    { type: String, required: true },
  status:        { type: String, enum: ["in_progress", "completed"], default: "in_progress" },
  questions:     [ { question: String, answer: String, feedback: String, score: Number } ],
  summary:       { overallScore: Number, strengths: [String], improvements: [String], finalVerdict: String },
  createdAt:     { type: Date, default: Date.now }
}
```

### Roadmap Model (`roadmap` service)
```javascript
{
  userId:        { type: String, required: true },
  role:          { type: String, required: true },
  targetPackage: { type: String, required: true },
  duration:      { type: String },
  steps:         [ { title: String, description: String, subtopics: [String], resources: [{ name: String, url: String }] } ],
  createdAt:     { type: Date, default: Date.now }
}
```

### Billing Model (`billing` service)
```javascript
{
  userId:             { type: String, required: true },
  amount:             { type: Number, required: true },
  interviewCoins:     { type: Number, required: true },
  razorpayOrderId:    { type: String, required: true, unique: true },
  razorpayPaymentId:  { type: String },
  razorpaySignature:  { type: String },
  status:             { type: String, enum: ["created", "paid", "failed"], default: "created" },
  createdAt:          { type: Date, default: Date.now }
}
```

---

## 5. Performance & Caching Strategy

1. **Redis Session Store (`session:<sessionId>`):** Fast 7-day TTL read access for API Gateway auth check on every request (eliminating DB lookups per route hit).
2. **Resume Cache (`resume:<userId>`):** Cached resume evaluation data avoids re-executing LLM parsing when users reload their dashboard.
3. **User Roadmaps Cache (`userRoadmaps:<userId>`):** Caches array of roadmaps generated by a user with explicit invalidation (`redis.del`) when new roadmaps are generated.
4. **Single-Roadmap Cache (`roadmap:<id>`):** 1-hour expiration (`EX 3600`) for individual roadmap step views.
