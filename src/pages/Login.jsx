// src/pages/Login.jsx
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

/**
 * Simple Google sign-in button placeholder.
 * If you support OAuth with backend, your backend should redirect user to provider and come back to /oauth-callback.
 */
function GoogleSignInButton() {
  const handle = () => {
    // if using OAuth backend, navigate to backend auth URL e.g. /api/auth/oauth/google
    // window.location.href = import.meta.env.VITE_API_BASE + "/api/auth/oauth/google";
    // For now show simple alert (or call backend endpoint)
    alert("Google sign-in: implement OAuth redirect to backend.");
  };
  return (
    <button
      onClick={handle}
      className="w-full border rounded-lg py-3 flex items-center justify-center gap-3 hover:shadow transition"
      type="button"
    >
      <img src="/google-icon.svg" alt="Google" style={{ width: 20, height: 20 }} />
      <span>Sign in with Google</span>
    </button>
  );
}

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await login({ email, password });
      setLoading(false);
      if (!res.ok) {
        setErr(res.message || "Login failed");
        return;
      }
      // success -> go to home or intended page
      navigate("/");
    } catch (ex) {
      setLoading(false);
      setErr(ex.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 card">
      <h2 className="text-3xl font-semibold mb-6">Login</h2>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
            autoComplete="email"
          />
        </div>

        <div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium mb-1">Password</label>
            <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">Forgot?</Link>
          </div>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
            autoComplete="current-password"
          />
        </div>

        {err && <div className="text-red-600 text-sm">{err}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>

      <div className="my-4 flex items-center">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="px-3 text-sm text-gray-500">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <GoogleSignInButton />

      <div className="text-center mt-4 text-sm">
        Don’t have an account? <Link to="/signup" className="text-indigo-600 hover:underline">Create account</Link>
      </div>
    </div>
  );
}
