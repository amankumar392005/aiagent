# 🗺️ Roadmap Microservice

The **Roadmap Service** generates personalized career acceleration roadmaps tailored to target job roles, target compensation packages, and candidate background (optionally integrating resume data).

---

## 🤖 Graph Architecture (`roadmap.graph.js`)

Uses `@langchain/langgraph` to execute a 2-stage generation pipeline:

1. **`roadmapNode` (`roadmap.agent.js`):** Generates structured modules, milestones, and subtopics.
2. **`resourceNode` (`resource.agent.js`):** Enriches each subtopic with curated online learning links, documentation, and course resources.

---

## 📁 Directory Structure

```
roadmap/
├── agents/
│   ├── resource.agent.js       # Online resource finder agent
│   └── roadmap.agent.js        # Career module & step generation agent
├── configs/
│   ├── db.js                   # Mongoose connection
│   └── llm.js                  # ChatGoogleGenerativeAI setup
├── controllers/
│   └── roadmap.controller.js  # Generate, Get All, Get By ID logic
├── graph/
│   └── roadmap.graph.js        # State graph linking roadmap & resource nodes
├── models/
│   └── roadmap.model.js        # Roadmap schema
├── routes/
│   └── roadmap.route.js        # Express routes
└── index.js                    # Express Server (Port 6004)
```

---

## ⚙️ Environment Configuration

```env
PORT=6004
MONGO_URI=mongodb://localhost:27017/aiagent_roadmap
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key_here
```
