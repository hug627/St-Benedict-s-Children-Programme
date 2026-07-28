import jwt from "jsonwebtoken";

// Reads the JWT from an httpOnly cookie (set at login/signup) and attaches
// the decoded payload ({ userId, role }) to req.user. Blocks the request
// with 401 if there's no valid token.
export function requireAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { userId, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired or invalid. Please log in again." });
  }
}

// Use after requireAuth to restrict a route to specific roles, e.g.:
//   router.get("/admin-only", requireAuth, requireRole("admin"), handler)
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "You don't have permission to do that." });
    }
    next();
  };
}