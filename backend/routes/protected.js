import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Any logged-in user (any role) can access this.
router.get("/dashboard", requireAuth, (req, res) => {
  res.json({ message: `Welcome, user #${req.user.userId}. You are logged in.` });
});

// Only users with role === "admin" can access this.
router.get("/admin/reports", requireAuth, requireRole("admin"), (req, res) => {
  res.json({ message: "Here are the admin-only reports." });
});

export default router;

// To wire this up, add to server.js:
//   import exampleProtectedRoutes from "./routes/example-protected.js";
//   app.use("/api", exampleProtectedRoutes);
