import express from "express"
import dotenv from "dotenv"
dotenv.config()
import proxy from "express-http-proxy"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { getCurrentUser } from "./controllers/user.controller.js"
import { isAuth } from "./middleware/isAuth.js"
import { proxyWithHeaders } from "./utils/proxyWithHeaders.js"
const app = express()

// Allow multiple origins for CORS (production Vercel + local dev)
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173"
].filter(Boolean)

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true)
        
        const isAllowed = 
            origin.includes("localhost") || 
            origin.includes("vercel.app") ||
            (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL);

        if (isAllowed) {
            return callback(null, true)
        }
        
        console.warn(`Blocked by CORS: ${origin}`);
        return callback(new Error("Not allowed by CORS"))
    },
    credentials: true
}))

app.use(morgan("dev"))
app.use(cookieParser())

const PORT = process.env.PORT || 6000

app.get("/" , (req,res)=>{
    res.send("Hello from Gateway")
})


// Auth proxy: strip /api/auth prefix before forwarding to auth service
app.use("/api/auth" , proxy(process.env.AUTH_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
        // req.url here is the path AFTER the mount point "/api/auth"
        // e.g., for /api/auth/login, req.url = /login
        return req.url
    }
}))
app.use("/api/resume" ,isAuth, proxyWithHeaders(process.env.RESUME_SERVICE_URL))
app.use("/api/interview",isAuth ,proxyWithHeaders(process.env.INTERVIEW_SERVICE_URL))
app.use("/api/roadmap",isAuth ,proxyWithHeaders(process.env.ROADMAP_SERVICE_URL))
app.use("/api/billing",isAuth ,proxyWithHeaders(process.env.BILLING_SERVICE_URL))
app.get("/api/me",isAuth,getCurrentUser)



app.listen(PORT , ()=>{
    console.log("Gateway Started on " + PORT)
})