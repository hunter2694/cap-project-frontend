// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { post, apiWithAuthGet } from "../api/api.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem("cyberaware_token"); } catch { return null; }
  });
  const [user, setUser] = useState(() => {
    try { const raw = localStorage.getItem("cyberaware_user"); return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // persist token/user
  useEffect(() => { if (token) localStorage.setItem("cyberaware_token", token); else localStorage.removeItem("cyberaware_token"); }, [token]);
  useEffect(() => { if (user) localStorage.setItem("cyberaware_user", JSON.stringify(user)); else localStorage.removeItem("cyberaware_user"); }, [user]);

  const decodeJWT = (jwt) => {
    try {
      const base64 = jwt.split(".")[1];
      const payload = JSON.parse(atob(base64.replace(/-/g, "+").replace(/_/g, "/")));
      return { id: payload.id || null, email: payload.sub || payload.email || null, username: payload.username || payload.sub || payload.email || null };
    } catch { return null; }
  };

  useEffect(() => {
    let cancelled = false;
    async function init() {
      if (token && !user) {
        try {
          // call /api/auth/me — might fail due to CORS or server, catch and fallback
          const resp = await apiWithAuthGet("/api/auth/me");
          if (!cancelled && resp && resp.user) setUser(resp.user);
          else if (!cancelled) {
            const d = decodeJWT(token);
            if (d) setUser(d);
          }
        } catch (err) {
          // log for debugging, but don't crash – fallback decode
          console.warn("Auth bootstrap /me failed:", err.message || err);
          if (!cancelled) {
            const d = decodeJWT(token);
            if (d) setUser(d);
          }
        }
      }
      setAuthReady(true);
    }
    init();
    return () => { cancelled = true; };
  }, []); // run once

  async function login({ email, password }) {
    setLoading(true);
    try {
      const body = await post("/api/auth/login", { email, password });
      if (body?.token) setToken(body.token);
      if (body?.user) setUser(body.user);
      else if (body?.token) {
        const d = decodeJWT(body.token); if (d) setUser(d);
      }
      setLoading(false);
      return { ok: true };
    } catch (err) {
      setLoading(false);
      return { ok: false, message: err.message || "Login failed" };
    }
  }

  async function signup(payload) {
    setLoading(true);
    try {
      const body = await post("/api/auth/signup", payload);
      if (body?.token) setToken(body.token);
      if (body?.user) setUser(body.user);
      else if (body?.token) {
        const d = decodeJWT(body.token); if (d) setUser(d);
      }
      setLoading(false);
      return { ok: true };
    } catch (err) {
      setLoading(false);
      return { ok: false, message: err.message || "Signup failed" };
    }
  }

  function logout() {
    setToken(null); setUser(null);
    localStorage.removeItem("cyberaware_token"); localStorage.removeItem("cyberaware_user");
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, authReady, login, signup, logout, isAuthenticated: () => Boolean(token) }}>
      {children}
    </AuthContext.Provider>
  );
}
