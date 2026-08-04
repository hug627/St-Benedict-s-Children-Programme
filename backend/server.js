import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";

const app = express();

// 1. Dynamic CORS setup allowing Vercel frontends & local environments
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : "";

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    const isAllowed =
      (clientUrl && origin === clientUrl) ||
      origin.endsWith(".vercel.app") ||
      origin.includes("st-benedict") ||
      origin === "http://localhost:5173" ||
      origin === "http://localhost:3000";

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error("Blocked by CORS policy"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Enable CORS for all routes and handle preflight OPTIONS requests
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 2. Parsers
app.use(express.json());
app.use(cookieParser());

// 3. Root & Health Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 4. API Routes
app.use("/api/auth", authRoutes);

// 5. Database Connection & Server Startup
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB");
    console.error(err);
    process.exit(1);
  });
