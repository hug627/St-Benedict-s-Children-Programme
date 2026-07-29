import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";

const app = express();

// 1. Put CORS first! Allow process.env.CLIENT_URL and trim any potential trailing slash
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : "";

app.use(
  cors({
    origin: [clientUrl, "http://localhost:5173", "http://localhost:3000"], // includes local dev fallback
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// 2. Parsers come after CORS
app.use(express.json());
app.use(cookieParser());

// 3. Root route (fixes "Cannot GET /" when visiting the base URL)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 4. API Routes
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 5. Database Connection & Server Listen
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
