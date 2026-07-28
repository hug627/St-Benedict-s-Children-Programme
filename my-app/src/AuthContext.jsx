import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextValue.js";

const API_URL = "http://localhost:5000/api/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, email, role } | null
  const [loading, setLoading] = useState(true); // true while checking session on first load

  // On first load, ask the backend "am I logged in?" using the httpOnly
  // cookie that's automatically sent with the request.
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch(`${API_URL}/me`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  async function logout() {
    await fetch(`${API_URL}/logout`, { method: "POST", credentials: "include" });
    setUser(null);
  }

  // Call this after a successful login/signup response from AuthPage,
  // passing the `user` object the backend returned, so the rest of the
  // app updates immediately without waiting for another /me request.
  function setLoggedInUser(userData) {
    setUser(userData);
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, setLoggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
}
