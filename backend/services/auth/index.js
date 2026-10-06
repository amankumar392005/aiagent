
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDb } from "./configs/db.js";
import dns from "dns";

dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
]);

import authRouter from "./routes/auth.route.js";

dotenv.config();

const app = express();

// No CORS needed — this service only receives internal traffic from the Gateway proxy
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
    res.status(200).send("Auth Service is running!");
});

const PORT = process.env.PORT || 8000;

app.use("/", authRouter);

app.listen(PORT, () => {
    console.log(`Auth Service Started on ${PORT}`);
    connectDb();
});






















































// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import { connectDb } from "./configs/db.js";
// import dns from "dns"


// dns.setServers([
//       '1.1.1.1',
//       '8.8.8.8'
// ])
// import authRouter from "./routes/auth.route.js";
// dotenv.config();


// const app = express();

// app.use(express.json());

// app.use(cookieParser());

// const PORT = process.env.PORT || 6001

// app.use("/",authRouter);



// app.listen(PORT,() => {
//     console.log( `Auth Service Started on ${PORT}`);
//     connectDb()
//   }
// );