# 🎙️ Interview Microservice (LangGraph Multi-Agent)

The **Interview Service** runs multi-turn technical and HR mock interviews using a compiled **LangGraph State Graph** and **Google Gemini LLM**.

---

## 🤖 LangGraph State Machine Architecture

The interview workflow is driven by `@langchain/langgraph`:

```
                 +---------+
                 |  START  |
                 +---------+
                      |
              [ Action Router ]
               /             \
          (start)          (feedback)
             /                 \
            v                   v
   +-----------------+  +------------------+
   |  interviewNode  |  |  feedbackNode    |
   +-----------------+  +------------------+
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

### Agent Components

1. **`interviewAgent` (`interviewNode`):** Generates questions tailored to role, experience level, and type (HR or Technical).
2. **`feedbackAgent` (`feedbackNode`):** Evaluates user's answer per question, scoring from 1 to 10 with actionable feedback and ideal answer.
3. **`summaryAgent` (`summaryNode`):** Triggers upon interview completion, synthesizing candidate strengths, areas for improvement, overall score, and final hiring verdict.

---

## 📁 Directory Structure

```
interview/
├── agents/
│   ├── feedback.agent.js       # Answer evaluation agent
│   ├── interview.agent.js      # Question generation agent
│   └── summary.agent.js       # Final summary synthesis agent
├── config/
│   ├── db.js                   # Mongoose connection
│   └── llm.js                  # ChatGoogleGenerativeAI instance
├── controllers/
│   └── interview.controller.js # Start session, submit answer, fetch report
├── graph/
│   ├── graph.js                # StateGraph orchestration & compile()
│   ├── nodes.js                # Node handlers invoking agents
│   └── state.js                # LangGraph Annotation State Definition
├── models/
│   └── interview.model.js      # Interview mongo schema
├── prompts/
│   ├── feedbackPrompt.js       # Answer evaluation LLM prompt
│   ├── hrInterviewPrompt.js    # HR question generation LLM prompt
│   ├── summaryPrompt.js        # Final summary report LLM prompt
│   └── technicalInterviewPrompt.js # Technical question LLM prompt
├── routes/
│   └── interview.route.js      # API routes
└── index.js                    # Express Server (Port 6003)
```

---

## ⚙️ Environment Configuration

```env
PORT=6003
MONGO_URI=mongodb://localhost:27017/aiagent_interview
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key_here
```
