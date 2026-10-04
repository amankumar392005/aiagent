# 🚀 AI Agent — AI-Powered Career Preparation & Microservices Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19.x-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-v5.x-lightgrey.svg)](https://expressjs.com/)
[![LangChain](https://img.shields.io/badge/LangChain-LangGraph-orange.svg)](https://js.langchain.com/)
[![Redis](https://img.shields.io/badge/Redis-Session%20%26%20Cache-red.svg)](https://redis.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](#license)

An enterprise-grade, microservices-architected AI career development platform. **AI Agent** empowers job seekers with AI-driven ATS resume scoring, multi-agent interactive technical & HR mock interviews with real-time feedback, personalized career roadmap generation, and a seamless coin monetization system.

---

## 📖 Executive Summary & Features

- **🛡️ Centralized API Gateway & Stateless Auth:** Secure Express Gateway proxying requests to downstream microservices, validating cookie sessions stored in a distributed **Redis** session store, and forwarding authenticated user identities (`x-user-id`).
- **🤖 Multi-Agent AI Mock Interview Engine:** Powered by **LangChain & LangGraph State Graphs**, conducting multi-turn technical & HR mock interviews, question-by-question scoring, and generating overall performance evaluation reports.
- **📄 AI ATS Resume Scorer & Analyzer:** Extracts text from PDF uploads, parses skills against market demand via Google Gemini LLM, computes ATS compatibility scores, identifies missing skills, and delivers actionable recommendations.
- **🗺️ Personalized Career Roadmap Generator:** Multi-stage AI graph generating step-by-step career acceleration roadmaps with subtopic breakdowns and automated resource web recommendations.
- **💰 Monetization & Coin Ledger System:** Integrated coin wallet system powered by **Razorpay**, allowing candidates to purchase interview credits with HMAC SHA-256 payment verification.

---

## 🏗️ Architecture Overview

```
                      +---------------------------------------+
                      |   React 19 Frontend Web Application   |
                      +---------------------------------------+
                                          |
                                   HTTP / REST API
                                          v
                    +-------------------------------------------+
                    |        Express API Gateway (6000)          |
                    |   - Redis Session Authentication          |
                    |   - Cookie Parser & Header Decorator      |
                    +-------------------------------------------+
                                          |
        +-------------------+-------------+-------------+-------------------+
        |                   |                           |                   |
        v                   v                           v                   v
+---------------+   +---------------+           +---------------+   +---------------+
| Auth Service  |   | Resume Service|           | Interview Svc |   | Roadmap Svc   |
|  (Port 6001)  |   |  (Port 6002)  |           |  (Port 6003)  |   |  (Port 6004)  |
+---------------+   +---------------+           +---------------+   +---------------+
        |                   |                           |                   |
        |                   +------------+              |                   |
        v                                v              v                   v
+---------------+               +-------------------------------+   +---------------+
| Billing Svc   |               | LangChain / LangGraph Engine  |   | Google Gemini |
|  (Port 6005)  |               |  (Multi-Agent State Machine)  |   |    AI API     |
+---------------+               +-------------------------------+   +---------------+
        |                                       |                           |
        +-----------------------+---------------+---------------------------+
                                |
                                v
                     +--------------------+
                     |  Redis & MongoDB   |
                     +--------------------+
```

> 📘 **For deep-dive architectural diagrams, state machine flows, and database schemas, visit [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).**

---

## 📂 Repository Structure & Documentation Hub

```
.
├── docs/                              # 📚 Comprehensive Technical Documentation Hub
│   ├── README.md                      # Documentation Navigation Index
│   ├── ARCHITECTURE.md                # System Topology, Sequence Diagrams & Schemas
│   ├── API_DOCUMENTATION.md           # Full OpenAPI / REST API Endpoint Reference
│   ├── SETUP_GUIDE.md                 # Complete Developer & Docker Setup Guide
│   ├── SERVICES.md                    # Technical Microservices Deep-Dive
│   └── CONTRIBUTING.md                # Code Standards, Git Workflow & Guidelines
├── backend/                           # ⚙️ Node.js / Express Backend Microservices
│   ├── docker-compose.yml             # Redis infrastructure orchestration
│   ├── gateway/                       # API Gateway & Reverse Proxy
│   ├── shared/                        # Shared Redis Client Singleton
│   └── services/                      # Domain Microservices
│       ├── auth/                      # Firebase Auth, User Store & Coin Wallet
│       ├── billing/                   # Razorpay Order Creation & Verification
│       ├── interview/                 # Multi-Agent LangGraph Interview Engine
│       ├── resume/                    # PDF Text Extraction & Gemini ATS Analyzer
│       └── roadmap/                   # AI Career Roadmap & Resource Engine
└── frontend/                          # 💻 React 19 + Vite Web Application
```

---

## 📦 Microservices Breakdown

| Service Name | Port | Primary Tech | Main Responsibilities | Link to Specs |
| :--- | :--- | :--- | :--- | :--- |
| **Gateway** | `6000` | Express Proxy, Redis | Reverse proxying, Session validation, `x-user-id` header injection | [`gateway/README.md`](./backend/gateway/README.md) |
| **Auth** | `6001` | Express, Firebase Admin, MongoDB | Firebase ID token verify, session storage, coin wallet ledger | [`services/auth`](./backend/services/auth/README.md) |
| **Resume** | `6002` | Express, LangChain, Multer, Gemini | PDF parsing, ATS scoring, skill extraction & recommendation | [`services/resume`](./backend/services/resume/README.md) |
| **Interview**| `6003` | Express, LangGraph, Gemini | Multi-turn AI mock interview graph, feedback agent, final report | [`services/interview`](./backend/services/interview/README.md) |
| **Roadmap** | `6004` | Express, LangGraph, Gemini | Structured learning path generator, online resource recommender | [`services/roadmap`](./backend/services/roadmap/README.md) |
| **Billing** | `6005` | Express, Razorpay SDK, MongoDB | Razorpay order creation, payment signature verification | [`services/billing`](./backend/services/billing/README.md) |
| **Frontend**| `5173` | React 19, Vite, Redux, Tailwind | User interface, Monaco code editor, Redux state, Firebase auth | [`frontend/README.md`](./frontend/README.md) |

---

## ⚡ Quick Start Guide

### 1. Start Infrastructure (Redis)
```bash
cd backend
docker-compose up -d
```

### 2. Configure Environment Files
Refer to the complete Environment Variable Matrix in [`docs/SETUP_GUIDE.md`](./docs/SETUP_GUIDE.md) to set up `.env` files for Gateway, services, and frontend.

### 3. Launch Services (Development Mode)
```bash
# Gateway
cd backend/gateway && npm run dev

# Services
cd backend/services/auth && npm run dev
cd backend/services/resume && npm run dev
cd backend/services/interview && npm run dev
cd backend/services/roadmap && npm run dev
cd backend/services/billing && npm run dev

# Frontend
cd frontend && npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🤝 Contributing

We welcome contributions! Please review our [Engineering Standards & Contribution Guidelines](./docs/CONTRIBUTING.md) before submitting pull requests.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
