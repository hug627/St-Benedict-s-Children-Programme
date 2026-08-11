import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";

const app = express();

// 1. Dynamic CORS setup allowing the custom domain, Vercel previews & local dev
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : "";

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server, health checks)
    if (!origin) return callback(null, true);

    const isAllowed =
      (clientUrl && origin === clientUrl) ||
      origin.endsWith(".vercel.app") ||
      // Matches both the apex domain and the www subdomain, since visitors
      // can land on either — e.g. https://stbenedictschildrencentre.org
      // and https://www.stbenedictschildrencentre.org both end with this.
      origin.endsWith("stbenedictschildrencentre.org") ||
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
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// Enable CORS for all routes and handle preflight OPTIONS requests
app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));

// 2. Parsers
app.use(express.json());
app.use(cookieParser());

// 3. Root & Health Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Health check handles GET and HEAD requests efficiently
app
  .route("/api/health")
  .get((req, res) => res.status(200).json({ status: "ok" }))
  .head((req, res) => res.status(200).end());

// 4. Self-Pinging Function — keeps Render's free tier from sleeping
const startSelfPing = () => {
  const SERVER_URL = process.env.SERVER_URL || "https://st-benedict-s-children-programme-1.onrender.com";
  const INTERVAL = 10 * 60 * 1000; // Pings every 10 minutes

  setInterval(async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/health`, { method: "HEAD" });
      console.log(`[Self-Ping] Success: status ${response.status} at ${new Date().toISOString()}`);
    } catch (err) {
      console.error(`[Self-Ping] Failed: ${err.message}`);
    }
  }, INTERVAL);
};

// 5. API Routes
app.use("/api/auth", authRoutes);

// 6. Database Connection & Server Startup
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      // Start pinging itself only in production environments
      if (process.env.NODE_ENV === "production") {
        startSelfPing();
      }
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB");
    console.error(err);
    process.exit(1);
  });
