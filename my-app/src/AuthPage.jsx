import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAuth } from "./AuthContextValue.js";
import "./App.css";

// Uses VITE_API_URL or VITE_API, defaulting to your live Render backend URL
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API ||
  "https://st-benedict-s-children-programme-1.onrender.com";

const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap');
  .font-display { font-family: 'Fraunces', serif; }
  .font-body { font-family: 'Inter', sans-serif; }
`;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function AuthPage() {
  const [tab, setTab] = useState("login"); // "login" | "signup"
  const [forgotMode, setForgotMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setLoggedInUser } = useAuth();

  const cardRef = useRef(null);
  const formRef = useRef(null);
  const indicatorRef = useRef(null);
  const messageRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from(cardRef.current, { opacity: 0, y: 24, scale: 0.97, duration: 0.6, ease: "power3.out" });
  }, []);

  useGSAP(() => {
    if (!indicatorRef.current) return;
    const x = tab === "login" ? 0 : "100%";
    if (prefersReducedMotion()) {
      gsap.set(indicatorRef.current, { x });
      return;
    }
    gsap.to(indicatorRef.current, { x, duration: 0.35, ease: "power2.out" });
  }, [tab]);

  useGSAP(() => {
    if (!formRef.current || prefersReducedMotion()) return;
    gsap.from(formRef.current.children, { opacity: 0, y: 12, duration: 0.4, stagger: 0.05, ease: "power2.out" });
  }, [tab, forgotMode]);

  useGSAP(() => {
    if (!messageRef.current || !message.text) return;
    if (prefersReducedMotion()) {
      gsap.set(messageRef.current, { opacity: 1, x: 0 });
      return;
    }
    if (message.type === "error") {
      gsap.fromTo(messageRef.current, { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.4, ease: "elastic.out(1, 0.5)" });
    } else {
      gsap.fromTo(messageRef.current, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
    }
  }, [message]);

  // Helper: Every request includes credentials so the browser sends/receives cookies
  async function apiRequest(endpoint, body) {
    // Ensures clean URL construction without double slashes or missing /api/auth
    const cleanBase = BASE_URL.replace(/\/$/, "");
    const url = `${cleanBase}/api/auth${endpoint}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Server error. Please check your network or try again.");
    }

    if (!res.ok) throw new Error(data.message || "Something went wrong.");
    return data;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const data = await apiRequest("/login", { email, password });
      setLoggedInUser(data.user);
      setMessage({ text: `Welcome back, ${data.user?.name || "User"}!`, type: "success" });
      setTimeout(() => navigate("/"), 600);
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const data = await apiRequest("/signup", { name, email, password });
      setLoggedInUser(data.user);
      setMessage({ text: "Account created! You're now logged in.", type: "success" });
      setTimeout(() => navigate("/"), 600);
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const data = await apiRequest("/forgot-password", { email });
      setMessage({ text: data.message || "Reset link sent!", type: "success" });
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (next) => {
    setTab(next);
    setForgotMode(false);
    setMessage({ text: "", type: "" });
  };

  return (
    <div className="font-body relative flex min-h-screen items-center justify-center overflow-hidden bg-[#2F0F03] px-6 py-12">
      <style>{FONT_IMPORT}</style>

      <button
        onClick={() => navigate("/")}
        className="absolute left-6 top-6 flex items-center gap-1.5 text-sm font-medium text-[#FFDDAC] transition-opacity hover:opacity-70 md:left-10 md:top-10"
      >
        <span aria-hidden="true">←</span> Back to site
      </button>

      <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-[#FAAA48]/20 blur-3xl" />

      <div
        ref={cardRef}
        className="relative w-full max-w-md rounded-2xl bg-[#FFDDAC] p-8 shadow-2xl ring-1 ring-[#FAAA48]/20 md:p-10"
      >
        <button
          onClick={() => navigate("/")}
          className="font-display mb-7 block w-full text-center text-lg font-semibold text-[#2F0F03] transition-opacity hover:opacity-70"
        >
          St Benedict  Children's Programme 
        </button>

        <div className="relative mb-7 flex rounded-full bg-[#FAAA48]/20 p-1">
          <div ref={indicatorRef} className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-[#2F0F03]" />
          <button
            onClick={() => switchTab("login")}
            className={`relative z-10 flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
              tab === "login" ? "text-[#FFDDAC]" : "text-[#2F0F03]"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => switchTab("signup")}
            className={`relative z-10 flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
              tab === "signup" ? "text-[#FFDDAC]" : "text-[#2F0F03]"
            }`}
          >
            Sign Up
          </button>
        </div>

        {forgotMode ? (
          <form ref={formRef} onSubmit={handleForgotPassword} className="flex flex-col gap-4">
            <p className="text-sm text-[#2F0F03]/70">
              Enter your email and we'll send you a link to reset your password.
            </p>
            <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
            <SubmitButton loading={loading}>Send Reset Link</SubmitButton>
            <button
              type="button"
              onClick={() => setForgotMode(false)}
              className="text-center text-sm font-medium text-[#2F0F03]/70 hover:text-[#2F0F03]"
            >
              ← Back to log in
            </button>
          </form>
        ) : tab === "login" ? (
          <form ref={formRef} onSubmit={handleLogin} className="flex flex-col gap-4">
            <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setForgotMode(true)}
              className="-mt-2 text-right text-xs font-medium text-[#2F0F03]/70 hover:text-[#2F0F03]"
            >
              Forgot password?
            </button>
            <SubmitButton loading={loading}>Log In</SubmitButton>
          </form>
        ) : (
          <form ref={formRef} onSubmit={handleSignup} className="flex flex-col gap-4">
            <Field label="Full Name" type="text" value={name} onChange={setName} autoComplete="name" required />
            <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              minLength={6}
              required
            />
            <SubmitButton loading={loading}>Create Account</SubmitButton>
          </form>
        )}

        {message.text && (
          <p
            ref={messageRef}
            className={`mt-4 text-center text-sm ${
              message.type === "error" ? "font-medium text-red-700" : "font-medium text-[#2F0F03]"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, required, minLength, autoComplete }) {
  return (
    <label className="block text-sm font-medium text-[#2F0F03]/80">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className="mt-1 w-full rounded-lg border border-[#2F0F03]/20 bg-white px-3 py-2.5 text-sm text-[#2F0F03] transition-shadow focus:outline-none focus:ring-2 focus:ring-[#FAAA48]"
      />
    </label>
  );
}

function SubmitButton({ children, loading }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-2 w-full rounded-full bg-[#FAAA48] py-3 text-sm font-semibold text-[#2F0F03] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
