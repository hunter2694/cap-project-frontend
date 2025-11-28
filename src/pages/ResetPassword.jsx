// src/pages/ResetPassword.jsx
import React, { useEffect, useState } from "react";
import { post } from "../api/api.js";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // expected in reset link: /reset-password?token=...
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing token. Please request a new password reset link.");
    }
  }, [token]);

  const validate = () => {
    if (!password || password.length < 8) {
      return "Password must be at least 8 characters.";
    }
    if (password !== confirm) {
      return "Passwords do not match.";
    }
    return null;
  };

  const submit = async (e) => {
    e && e.preventDefault();
    setError(null);
    setInfo(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    if (!token) {
      setError("Missing token.");
      return;
    }

    setLoading(true);
    try {
      // POST /api/auth/reset { token, password }
      await post("/api/auth/reset", { token, password });
      setInfo("Your password has been reset. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.message || "Failed to reset password. The reset link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 card">
      <h2 className="text-2xl font-semibold mb-4">Set a new password</h2>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-700 mb-1">New password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-700 mb-1">Confirm new password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat your password"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg"
            disabled={loading}
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        {info && <div className="text-green-600 text-sm">{info}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-medium disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save new password"}
        </button>
      </form>
    </div>
  );
}
