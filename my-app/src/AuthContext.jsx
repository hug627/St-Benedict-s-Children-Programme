import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextValue.js";

// Uses the deployed backend in production and localhost during development.
const API_URL = `${import.meta.env.VITE_API}/api/auth`;
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check whether the user is already logged in
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
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
      await fetch(`${API_URL}/api/auth/logout`, {
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
