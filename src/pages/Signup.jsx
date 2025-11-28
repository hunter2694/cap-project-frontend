// src/pages/Signup.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton.jsx";

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const nav = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const res = await signup(form);
    setLoading(false);
    if (!res.ok) setErr(res.message);
    else nav("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-10 card">
      <h2 className="text-2xl font-semibold mb-6">Create account</h2>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handle}
            placeholder="you@example.com"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handle}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm text-gray-700 mb-1">First name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handle}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-700 mb-1">Last name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handle}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handle}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
          />
        </div>

        {err && <div className="text-red-600 text-sm">{err}</div>}

        <button
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      {/* Separator */}
      <div className="flex items-center my-4">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="mx-3 text-gray-500 text-sm">or</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <GoogleSignInButton mode="signup" />

      <div className="text-center mt-4 text-sm">
        Have an account?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline">Log in</Link>
      </div>
    </div>
  );
}
