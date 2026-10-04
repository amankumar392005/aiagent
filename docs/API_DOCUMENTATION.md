# 🔌 REST API Specification

This document provides the complete API specification for the API Gateway and downstream microservices.

---

## Base URL & Conventions

- **Gateway Base URL:** `http://localhost:6000` (or production hostname)
- **Content-Type:** `application/json` (except multi-part file uploads)
- **Authentication:** Cookie-based (`session=<sessionId>`). API Gateway validates session and forwards `x-user-id` to downstream microservices.

---

## 1. Authentication Service (`/api/auth`)

### 1.1 Login User
Verify Firebase Client ID Token, authenticate or register user, initialize Redis session, and set HttpOnly session cookie.

- **Method:** `POST`
- **Path:** `/api/auth/login`
- **Auth Required:** No
- **Request Body:**
```json
{
  "token": "eyJhbGciOiJSUzI1NiIs..."
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "6704b123a4f892c901234567",
    "firebaseUid": "FIREBASE_UID_123",
    "email": "candidate@example.com",
    "name": "Jane Doe",
    "interviewCoin": 100,
    "createdAt": "2026-10-04T12:00:00.000Z"
  }
}
```
- **Response (401 Unauthorized):**
```json
{
  "message": "Firebase ID token has expired or is invalid."
}
```

---

### 1.2 Get Current User
Fetch active session profile from Redis/Session state via Gateway.

- **Method:** `GET`
- **Path:** `/api/me`
- **Auth Required:** Yes
- **Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "userId": "6704b123a4f892c901234567",
    "name": "Jane Doe",
    "email": "candidate@example.com",
    "interviewCoin": 100
  }
}
```

---

### 1.3 Logout User
Invalidate Redis session key and clear browser session cookie.

- **Method:** `GET`
- **Path:** `/api/auth/logout`
- **Auth Required:** Yes
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 1.4 Deduct Coins (`use-coins`)
Deduct interview coins from user wallet for initiating AI interviews or actions.

- **Method:** `POST`
- **Path:** `/api/auth/use-coins`
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "coins": 20,
  "action": "start_interview"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Interview coins updated successfully",
  "action": "start_interview",
  "interviewCoin": 80
}
```

---

### 1.5 Add Coins (`add-coins`)
Top-up interview coins in user wallet.

- **Method:** `POST`
- **Path:** `/api/auth/add-coins`
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "coins": 300
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Coins added successfully",
  "interviewCoin": 380
}
```

---

## 2. Resume Service (`/api/resume`)

### 2.1 Upload & Parse Resume
Upload PDF resume, extract plain text, execute Gemini AI parsing agent, save analysis to MongoDB & Redis cache, and return ATS analysis.

- **Method:** `POST`
- **Path:** `/api/resume/upload`
- **Auth Required:** Yes
- **Content-Type:** `multipart/form-data`
- **Form Fields:** `resume` (File, PDF format)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Resume analyzed successfully",
  "data": {
    "_id": "6704c987b12345a987654321",
    "userId": "6704b123a4f892c901234567",
    "score": 85,
    "skills": ["JavaScript", "React", "Node.js", "Express", "MongoDB"],
    "missingSkills": ["TypeScript", "Docker", "Kubernetes"],
    "recommendations": [
      "Add quantitative metrics to your project experience",
      "Include certification or experience with Docker"
    ],
    "summary": "Strong Full Stack Developer candidate with high proficiency in JavaScript ecosystem."
  }
}
```

---

### 2.2 Get Analyzed Resume
Fetch stored ATS resume analysis for authenticated user.

- **Method:** `GET`
- **Path:** `/api/resume`
- **Auth Required:** Yes
- **Response (200 OK):**
```json
{
  "success": true,
  "source": "redis",
  "data": {
    "_id": "6704c987b12345a987654321",
    "userId": "6704b123a4f892c901234567",
    "score": 85,
    "skills": ["JavaScript", "React", "Node.js"],
    "missingSkills": ["TypeScript", "Docker"]
  }
}
```

---

## 3. Interview Service (`/api/interview`)

### 3.1 Start AI Interview Session
Triggers LangGraph `interviewNode` agent to create tailored technical or HR questions.

- **Method:** `POST`
- **Path:** `/api/interview/start`
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "type": "technical",
  "role": "Full Stack Engineer",
  "experience": "2-4 years",
  "questionCount": 5
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Interview session started successfully",
  "interviewId": "6704d888e4f123a456789012",
  "questions": [
    {
      "id": 1,
      "question": "Explain how event delegation works in JavaScript and its performance benefits."
    }
  ]
}
```

---

### 3.2 Submit Answer & Receive AI Feedback
Submits user answer for a question and triggers LangGraph `feedbackNode`. If final question, runs `summaryNode`.

- **Method:** `POST`
- **Path:** `/api/interview/:interviewId/answer`
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "questionIndex": 0,
  "answer": "Event delegation is a pattern where we attach a single event listener to a parent element to handle events on its children using event bubbling."
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "feedback": {
    "score": 9,
    "evaluation": "Excellent understanding of event propagation and DOM bubbling.",
    "idealAnswer": "Event delegation leverages event bubbling to handle events at a higher level in the DOM tree, reducing memory consumption by avoiding multiple listeners."
  },
  "isCompleted": false
}
```

---

### 3.3 Get Interview Report
Fetches final interview feedback report and summary score.

- **Method:** `GET`
- **Path:** `/api/interview/:interviewId/report`
- **Auth Required:** Yes
- **Response (200 OK):**
```json
{
  "success": true,
  "report": {
    "_id": "6704d888e4f123a456789012",
    "role": "Full Stack Engineer",
    "type": "technical",
    "status": "completed",
    "summary": {
      "overallScore": 8.5,
      "strengths": ["Strong DOM & JS fundamentals", "Clear communication"],
      "improvements": ["Deepen knowledge on asynchronous Event Loop queues"],
      "finalVerdict": "Strong Hire candidate for Mid-level Frontend / Full Stack role."
    }
  }
}
```

---

## 4. Roadmap Service (`/api/roadmap`)

### 4.1 Generate Career Roadmap
Triggers LangGraph multi-stage roadmap generation agent.

- **Method:** `POST`
- **Path:** `/api/roadmap/generate`
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "role": "Backend Engineer",
  "targetPackage": "15-20 LPA",
  "useResume": true,
  "resume": "Experienced in Node.js, Express, MongoDB..."
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Roadmap generated successfully.",
  "data": {
    "_id": "6704e111a998877665544332",
    "userId": "6704b123a4f892c901234567",
    "role": "Backend Engineer",
    "targetPackage": "15-20 LPA",
    "steps": [
      {
        "title": "Module 1: Advanced System Architecture & Microservices",
        "description": "Learn message queues, API gateways, and distributed caching.",
        "subtopics": ["Kafka/RabbitMQ", "Redis Cache Patterns", "gRPC"],
        "resources": [
          { "name": "System Design Primer", "url": "https://github.com/donnemartin/system-design-primer" }
        ]
      }
    ]
  }
}
```

---

### 4.2 Get All User Roadmaps
- **Method:** `GET`
- **Path:** `/api/roadmap`
- **Auth Required:** Yes
- **Response (200 OK):** Array of saved user roadmaps.

---

### 4.3 Get Roadmap By ID
- **Method:** `GET`
- **Path:** `/api/roadmap/:id`
- **Auth Required:** Yes
- **Response (200 OK):** Single detailed roadmap object.

---

## 5. Billing Service (`/api/billing`)

### 5.1 Create Razorpay Order
- **Method:** `POST`
- **Path:** `/api/billing/create-order`
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "planId": "starter"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "order": {
    "id": "order_P1234567890",
    "amount": 19900,
    "currency": "INR",
    "receipt": "receipt_1728065400000"
  }
}
```

---

### 5.2 Verify Razorpay Payment Signature
- **Method:** `POST`
- **Path:** `/api/billing/verify-payment`
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "razorpay_order_id": "order_P1234567890",
  "razorpay_payment_id": "pay_Q9876543210",
  "razorpay_signature": "a1b2c3d4e5f6..."
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment successful"
}
```
