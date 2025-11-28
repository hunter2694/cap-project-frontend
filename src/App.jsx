// src/App.jsx
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Nav from "./components/Nav.jsx";

// pages (ensure these exist)
import Home from "./pages/Home.jsx";
import Quiz from "./pages/Quiz.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import CertificatePage from "./pages/CertificatePage.jsx";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import OAuthCallback from "./pages/OAuthCallback.jsx";

// Contexts
import { AuthContext } from "./context/AuthContext.jsx";
import QuizProvider from "./context/QuizContext.jsx"; // default export used as provider

/**
 * App root with routes. QuizProvider is mounted here so all routes/pages
 * (Quiz, Certificate, Leaderboard, etc.) can use QuizContext safely.
 */
export default function App() {
  return (
    <Router>
      <Nav />
      <main className="p-6 max-w-5xl mx-auto">
        <QuizProvider>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/oauth-callback" element={<OAuthCallback />} />

            {/* Protected routes */}
            <Route path="/quiz" element={<RequireAuth><Quiz /></RequireAuth>} />
            <Route path="/leaderboard" element={<RequireAuth><Leaderboard /></RequireAuth>} />
            <Route path="/certificate" element={<RequireAuth><CertificatePage /></RequireAuth>} />

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </QuizProvider>
      </main>
    </Router>
  );
}

/**
 * RequireAuth - wrapper component to protect routes.
 * Waits for AuthContext bootstrap (authReady) before redirecting.
 */
function RequireAuth({ children }) {
  const { token, authReady } = useContext(AuthContext);

  // while auth is initializing, show a minimal loader so we don't redirect prematurely
  if (!authReady) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <div>Checking authentication…</div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
