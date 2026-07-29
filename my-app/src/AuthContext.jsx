import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextValue.js";

// 1. Base API URL (fallback to Render if VITE_API is missing)
const BASE_URL = import.meta.env.VITE_API || "https://st-benedict-s-children-programme-1.onrender.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check whether the user is already logged in
  useEffect(() => {
    async function checkSession() {
      try {
        // 2. Fixed path: BASE_URL + /api/auth/me
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Session check failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  // Logout user
  async function logout() {
    try {
      // 3. Fixed path: BASE_URL + /api/auth/logout
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }

    setUser(null);
  }

  // Update user after successful login/signup
  function setLoggedInUser(userData) {
    setUser(userData);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        setLoggedInUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
