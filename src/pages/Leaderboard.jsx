// src/pages/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import { apiWithAuthGet } from "../api/api.js";

export default function Leaderboard() {
  const [list, setList] = useState([]);
  const [filterDifficulty, setFilterDifficulty] = useState(""); // "" = All
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // helper to load leaderboard (all or by difficulty)
  async function loadLeaderboard(difficulty = "") {
    setLoading(true);
    setError(null);

    try {
      let data;
      if (difficulty && difficulty !== "") {
        // call backend filtered endpoint
        data = await apiWithAuthGet(`/api/leaderboard/${encodeURIComponent(difficulty)}`);
      } else {
        // call backend all endpoint
        data = await apiWithAuthGet("/api/leaderboard");
      }

      // Ensure we always set an array
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      setError(err.message || "Failed to load leaderboard");
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  // Load on mount
  useEffect(() => {
    loadLeaderboard(filterDifficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload when filter changes
  useEffect(() => {
    loadLeaderboard(filterDifficulty);
  }, [filterDifficulty]);

  const filtered = list; // already fetched filtered list from backend

  return (
    <div className="card max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>

      <div className="flex items-center gap-3 mb-4">
        <label htmlFor="difficulty" className="text-sm text-slate-600">
          Filter:
        </label>

        <select
          id="difficulty"
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </select>

        <button
          onClick={() => loadLeaderboard(filterDifficulty)}
          className="ml-auto px-3 py-1 text-sm bg-indigo-600 text-white rounded"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-600">Loading leaderboard…</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">Error: {error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-slate-500">No entries yet. Complete quizzes to add entries.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="text-left text-sm text-slate-500">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Name</th>
                <th className="p-2">Difficulty</th>
                <th className="p-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id ?? i} className="border-t">
                  <td className="py-2 px-2">{i + 1}</td>
                  <td className="py-2 px-2">{r.username || r.name || "Anonymous"}</td>
                  <td className="py-2 px-2">{r.difficulty}</td>
                  <td className="py-2 px-2">{r.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
