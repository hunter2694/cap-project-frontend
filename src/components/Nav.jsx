import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Nav() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <nav className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-lg">CyberAware</Link>
          <Link to="/quiz" className="text-sm text-slate-600">Quiz</Link>
          <Link to="/leaderboard" className="text-sm text-slate-600">Leaderboard</Link>
          <Link to="/certificate" className="text-sm text-slate-600">Certificate</Link>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-700">Hi, {user.username || user.email}</span>
              <button className="px-3 py-1 rounded bg-slate-100" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="px-3 py-1 rounded bg-slate-100">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
