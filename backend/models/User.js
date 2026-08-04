import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },

    // Permissions live here. Every new signup defaults to "user".
    // Promote someone to "admin" manually (e.g. directly in the database,
    // or via a small internal script) — never let a client set their own role.
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Password reset flow
    resetPasswordTokenHash: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

// Check if model exists before compiling to prevent OverwriteModelError crashes
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
