# 📚 Project Documentation Hub

Welcome to the central documentation hub for **AI Agent** — an enterprise-grade, microservices-based AI Career Preparation & Resume Building Platform.

---

## 📌 Quick Navigation

| Document | Description | Target Audience |
| :--- | :--- | :--- |
| 🏗️ [**Architecture & System Design**](./ARCHITECTURE.md) | High-level topology, API Gateway pattern, LangChain/LangGraph workflow, Redis session mechanics, and MongoDB schemas. | Architects, System Engineers, Tech Leads |
| 🚀 [**Developer & Setup Guide**](./SETUP_GUIDE.md) | Step-by-step local setup, Docker deployment, Firebase configuration, Razorpay integration, and environment matrix. | Developers, DevOps, QA |
| 🔌 [**API Specification**](./API_DOCUMENTATION.md) | Complete REST API endpoint reference for Gateway and all downstream microservices with payloads. | Frontend Engineers, API Integrators |
| ⚙️ [**Microservices Breakdown**](./SERVICES.md) | In-depth technical breakdown of Gateway, Auth, Resume, Interview, Roadmap, and Billing microservices. | Backend Engineers, Module Owners |
| 🤝 [**Contributing & Engineering Standards**](./CONTRIBUTING.md) | Code conventions, Git workflow, linting guidelines, security policies, and extending the platform. | All Contributors |

---

## 🧭 Repository Structure Overview

```
.
├── README.md                          # Main project landing page
├── docs/                              # Industry-standard documentation suite
│   ├── README.md                      # Documentation hub index (this file)
│   ├── ARCHITECTURE.md                # System design & architecture details
│   ├── API_DOCUMENTATION.md           # OpenAPI/REST API specification
│   ├── SETUP_GUIDE.md                 # Complete environment & installation guide
│   ├── SERVICES.md                    # Microservices deep-dive documentation
│   └── CONTRIBUTING.md                # Engineering practices & contribution guidelines
├── backend/                           # Node.js / Express Microservices Core
│   ├── README.md                      # Backend architecture overview
│   ├── docker-compose.yml             # Local redis orchestrator
│   ├── gateway/                       # API Gateway & Reverse Proxy (Express + Session Middleware)
│   ├── shared/                        # Shared utilities (ioredis client singleton)
│   └── services/                      # Decoupled Domain Microservices
│       ├── auth/                      # Firebase Auth, User Management & Coin Ledger
│       ├── billing/                   # Razorpay Payments & Order Verification
│       ├── interview/                 # LangGraph Multi-Agent Mock Interview Engine
│       ├── resume/                    # PDF Text Extractor & Gemini ATS Analyzer
│       └── roadmap/                   # LangGraph Career Roadmap & Resource Engine
└── frontend/                          # React 19 + Vite + TailwindCSS Web Application
    └── README.md                      # Frontend architecture & state management guide
```

---

## 🛠️ Key Technologies

- **Frontend:** React 19, Vite, Redux Toolkit, React Router v7, Monaco Editor, Tailwind CSS, Motion (Framer), Firebase Auth SDK
- **Backend:** Node.js (ES Modules), Express.js 5.x, Express HTTP Proxy, Morgan, Cookie-Parser
- **AI & Agent Orchestration:** LangChain, LangGraph State Graphs, Google Gemini AI (via `@langchain/google-genai`)
- **Database & Cache:** MongoDB (Mongoose ORM), Redis (ioredis) for distributed session storage & API response caching
- **Authentication & Payments:** Firebase Admin SDK (Decoded ID Tokens), Razorpay SDK

---

## 📞 Support & Inquiries

For technical queries or contribution discussions, refer to [CONTRIBUTING.md](./CONTRIBUTING.md) or open an issue on the project repository.
