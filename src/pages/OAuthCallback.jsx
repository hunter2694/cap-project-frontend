// src/pages/OAuthCallback.jsx
import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokenFromBackend } = useContext(AuthContext); // we'll add this helper in AuthContext
  const [err, setErr] = useState(null);

  useEffect(() => {
    // Expect backend to redirect to e.g.: /oauth-callback?token=<JWT>
    const token = searchParams.get("token");
    const userJson = searchParams.get("user"); // optional: backend may include user info as JSON string
    if (token) {
      try {
        setTokenFromBackend(token, userJson ? JSON.parse(decodeURIComponent(userJson)) : null);
        navigate("/", { replace: true });
      } catch (e) {
        setErr("Login failed");
        console.error(e);
      }
      return;
    }

    // If no token in query, the backend may have set an httpOnly cookie with token.
    // In that case, you can call a /api/auth/me endpoint to fetch current user and token status.
    // We'll attempt that fallback (handled by AuthContext if you implement an endpoint).
    (async () => {
      try {
        // Optionally implement /api/auth/me on backend that returns user and maybe token
        const resp = await fetch(`${import.meta.env.VITE_API_BASE || window.__API_BASE__ || "http://localhost:8080"}/api/auth/me`, {
          method: "GET",
          credentials: "include"
        });
        if (!resp.ok) throw new Error("No session");
        const body = await resp.json();
        // If backend returns a token, store it
        if (body.token) {
          setTokenFromBackend(body.token, body.user || null);
        } else {
          // else, store user returned and assume cookie-based session
          if (body.user) {
            localStorage.setItem("cyberaware_user", JSON.stringify(body.user));
          }
        }
        navigate("/", { replace: true });
      } catch (e) {
        console.error("OAuth callback fallback failed", e);
        setErr("Authentication failed or cancelled.");
      }
    })();
  }, [searchParams, navigate, setTokenFromBackend]);

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="card">
        <h2 className="text-xl font-semibold">Signing you in…</h2>
        {err && <div className="text-red-600 mt-4">{err}</div>}
      </div>
    </div>
  );
}
