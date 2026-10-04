# 🤝 Contributing & Engineering Standards

Thank you for contributing to **AI Agent**! This guide outlines our engineering practices, code quality expectations, Git workflow, and security guidelines.

---

## 📐 Code Style & Conventions

- **Module Format:** ES Modules (`import`/`export`) across all backend services and frontend components.
- **Node.js Conventions:**
  - Standard async/await error handling wrapped in `try/catch` blocks.
  - Consistent JSON response format:
    ```json
    {
      "success": true | false,
      "message": "Human readable message",
      "data": {}
    }
    ```
  - Use exact status codes: `200` (Success), `201` (Created), `400` (Bad Request), `401` (Unauthorized), `403` (Forbidden), `404` (Not Found), `500` (Internal Error).

- **Frontend Conventions:**
  - Functional components with React 19 hooks.
  - Redux Toolkit slices for shared global state (`resumeSlice`, etc.).
  - Tailwind CSS for responsive styling.
  - Component files named with PascalCase (e.g. `ResumeBuilder.jsx`).

---

## 🌿 Git Branching & Workflow

1. **Main Branch Protection:** Direct commits to `main` are restricted.
2. **Branch Naming Conventions:**
   - Feature: `feature/short-description` (e.g., `feature/interview-audio-recorder`)
   - Bugfix: `fix/short-description` (e.g., `fix/redis-session-ttl`)
   - Docs: `docs/short-description` (e.g., `docs/api-update`)
3. **Commit Messages:** Follow Conventional Commits format:
   ```
   feat(interview): add real-time audio transcript handler
   fix(gateway): resolve CORS header mismatch for localhost
   docs(setup): update environment variable table
   ```

---

## 🔒 Security Policies & Secret Management

- **Secrets in Version Control:** NEVER commit `.env`, `serviceAccountKey.json`, or API credentials into Git.
- **Secret Scanning:** All `.env` and `serviceAccountKey.json` patterns are guarded by `.gitignore`.
- **Session Protection:** Session IDs are strictly stored in HttpOnly, SameSite=None, Secure cookies to mitigate XSS and CSRF exposure.

---

## ➕ Adding a New Microservice

When introducing a new domain service (e.g. `analytics` service):

1. Create directory under `backend/services/<service_name>`.
2. Add `package.json`, `.env.example`, `Dockerfile`, and `index.js`.
3. Use shared Redis client from `backend/shared/redis/redis.js`.
4. Register the new service proxy route in `backend/gateway/index.js`:
   ```javascript
   app.use("/api/analytics", isAuth, proxyWithHeaders(process.env.ANALYTICS_SERVICE_URL));
   ```
5. Update `docker-compose.yml`, `docs/API_DOCUMENTATION.md`, and `docs/SERVICES.md`.
