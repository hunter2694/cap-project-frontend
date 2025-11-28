// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { post } from "../api/api.js";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (s) => {
    return /\S+@\S+\.\S+/.test(s);
  };

  const submit = async (e) => {
    e && e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // POST /api/auth/forgot  { email }
      await post("/api/auth/forgot", { email });
      setInfo(
        "If that email exists in our system, a password reset link has been sent. Check your inbox (and spam)."
      );
    } catch (err) {
      // show friendly message (don't leak whether email exists)
      setError(err.message || "Failed to send reset email. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 card">
      <div className="text-center">
        {/* top illustration (simple SVG) */}
        <div className="mb-6">
          <svg width="72" height="72" viewBox="0 0 24 24" className="mx-auto text-slate-400">
            <path fill="currentColor" d="M13 2l7 7-1.5 1.5L17 6.5V20h-2V6.5L7.5 10.5 6 9 13 2z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2">Forgot your password?</h1>
        <p className="text-sm text-slate-500 mb-6">
          Enter your email so we can send a password reset link.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. username@company.com"
            className="w-full border border-gray-300 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300"
            disabled={loading}
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        {info && <div className="text-green-600 text-sm">{info}</div>}

        <button
          type="submit"
          className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-medium disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Email"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        <Link to="/login" className="inline-flex items-center gap-2 text-slate-700 hover:underline">
          <span className="inline-block">◂</span> Back to Login
        </Link>
      </div>
    </div>
  );
}
