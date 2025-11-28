// src/components/GoogleSignInButton.jsx
import React from "react";

const API_BASE = import.meta.env.VITE_API_BASE || window.__API_BASE__ || "http://localhost:8080";

export default function GoogleSignInButton({ mode = "login" }) {
  const label = mode === "signup" ? "Sign up with Google" : "Log in with Google";

  const handleClick = () => {
    const redirectUri = `${window.location.origin}/oauth-callback`;
    const url = `${API_BASE}/oauth2/authorize/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = url;
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg bg-white hover:bg-gray-50 transition"
    >
      {/* Google G Icon */}
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="w-5 h-5"
      />
      <span className="font-medium text-gray-700">{label}</span>
    </button>
  );
}
