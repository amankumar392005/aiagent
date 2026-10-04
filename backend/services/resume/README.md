# 📄 Resume Microservice

The **Resume Service** processes uploaded resume PDFs, extracts plain text content, and uses Google Gemini LLM to compute ATS compatibility scores, extract technical skills, identify skill gaps, and suggest improvement recommendations.

---

## ⚡ Execution Pipeline

```
PDF File Upload (Multer)
        │
        ▼
PDF Text Extractor (`pdf-parse`)
        │
        ▼
LangChain Resume Agent (`ChatGoogleGenerativeAI`)
        │
        ▼
Structured JSON Parser (Score, Skills, Missing Skills, Recommendations)
        │
        ▼
MongoDB Persistence + Redis Cache (`resume:<userId>`)
        │
        ▼
Temporary File Cleanup (`fs.unlinkSync`)
```

---

## 📁 Directory Structure

```
resume/
├── agents/
│   └── resume.agent.js         # LangChain Gemini resume analyzer agent
├── config/
│   ├── db.js                   # Mongoose connection
│   ├── llm.js                  # ChatGoogleGenerativeAI setup
│   └── pdf.js                  # PDF text extractor utility
├── controllers/
│   └── resume.controller.js    # Upload handler & Cache retrieval
├── middleware/
│   └── multer.js               # File upload middleware (uploads/)
├── models/
│   └── resume.model.js         # Resume Mongo schema
├── prompts/
│   └── resumePrompt.js         # ATS analysis prompt
├── routes/
│   └── resume.route.js         # API routes (/upload, GET /)
└── index.js                    # Express Server (Port 6002)
```

---

## ⚙️ Environment Configuration

```env
PORT=6002
MONGO_URI=mongodb://localhost:27017/aiagent_resume
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key_here
```
