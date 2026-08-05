import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Fixed: Replaced localhost with dynamic env variable + Render production fallback
const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/auth`
  : "https://st-benedict-s-children-programme-1.onrender.com/api/auth";
const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap');
  .font-display { font-family: 'Fraunces', serif; }
  .font-body { font-family: 'Inter', sans-serif; }
`;

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch(`${API_URL}/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage({ text: data.message, type: "success" });
      setTimeout(() => navigate("/auth"), 2000);
    } catch (err) {
      setMessage({ text: err.message || "Failed to connect to server", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-body flex min-h-screen items-center justify-center bg-[#2F0F03] px-6 py-12">
      <style>{FONT_IMPORT}</style>
      <div className="w-full max-w-md rounded-2xl bg-[#FFDDAC] p-8 shadow-2xl md:p-10">
        <h1 className="font-display mb-6 text-center text-xl font-semibold text-[#2F0F03]">
          Set a new password
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="block text-sm font-medium text-[#2F0F03]/80">
            New Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
              className="mt-1 w-full rounded-lg border border-[#2F0F03]/20 bg-white px-3 py-2.5 text-sm text-[#2F0F03] focus:outline-none focus:ring-2 focus:ring-[#FAAA48]"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-[#FAAA48] py-3 text-sm font-semibold text-[#2F0F03] transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? "Please wait..." : "Update Password"}
          </button>
        </form>
        {message.text && (
          <p className={`mt-4 text-center text-sm font-medium ${message.type === "error" ? "text-red-700" : "text-[#2F0F03]"}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
