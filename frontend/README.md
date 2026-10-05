# 💻 Frontend Web Application

The **Frontend App** is a modern React 19 single-page application powered by Vite, Redux Toolkit, Tailwind CSS, Motion (Framer), Monaco Editor, and Firebase Authentication.

---

## 🎨 Tech Stack & Libraries

- **Framework:** React 19 + Vite 8
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Routing:** React Router v7 (`react-router-dom`)
- **UI & Styling:** Tailwind CSS 4, React Icons (`react-icons`), Motion (`motion`), React Circular Progressbar (`react-circular-progressbar`)
- **Data Visualization & Editors:** Recharts (`recharts`), Monaco Editor (`@monaco-editor/react`)
- **Authentication:** Firebase Auth SDK (`firebase`)
- **HTTP Client:** Axios (`axios`) with `withCredentials: true`

---

## 📂 Application Directory Structure

```
frontend/src/
├── apis/                      # Axios API wrappers (auth, resume, interview, roadmap, billing)
├── assets/                    # Static assets, logos, and illustrations
├── components/                # Reusable UI components (Navbar, Sidebar, Modals, Cards)
├── pages/                     # Application pages
│   ├── Home.jsx               # Landing page & Firebase Auth modal
│   ├── Dashboard.jsx          # Candidate command center & stats
│   ├── Scorer.jsx             # ATS Resume analyzer & breakdown
│   ├── ResumeBuilder.jsx      # Resume generator & Monaco editor view
│   ├── InterviewStart.jsx     # Mock interview launcher & coin check
│   ├── InterviewPage.jsx      # Multi-turn Q&A interview room
│   ├── InterviewReport.jsx    # Post-interview AI feedback & verdict
│   ├── Roadmap.jsx            # Interactive step-by-step career path
│   └── Billing.jsx            # Coin purchase plan selection & Razorpay checkout
├── redux/                     # Redux slices (resumeSlice, userSlice)
├── utils/                     # Helper functions & formatters
├── App.jsx                    # Root router & initial session fetcher
├── index.css                  # Tailwind CSS import & global rules
└── main.jsx                   # DOM root mount & Redux provider wrapper
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the `frontend` root directory:

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

## 🏃 Commands

```bash
# Install dependencies
npm install

# Start Vite development server (Port 5173)
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```
