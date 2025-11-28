// src/components/DifficultySelector.jsx
import React, { useState } from "react";

/**
 * Props:
 *  - onSelect?: (levelKey:string) => void
 *  - isLoading?: boolean
 */
export default function DifficultySelector({ onSelect, isLoading = false }) {
  const [active, setActive] = useState(null);

  // safe call helper
  const safeCall = (fn, ...args) => {
    if (typeof fn === "function") {
      try { fn(...args); } catch (e) { console.error("onSelect threw:", e); }
    }
  };

  const difficulties = [
    { key: "beginner", label: "Beginner", color: "from-green-400 to-green-600" },
    { key: "intermediate", label: "Intermediate", color: "from-yellow-400 to-yellow-600" },
    { key: "expert", label: "Expert", color: "from-red-400 to-red-600" }
  ];

  const handleClick = (key) => {
    setActive(key);
    safeCall(onSelect, key);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
      {difficulties.map(d => (
        <button
          key={d.key}
          onClick={() => handleClick(d.key)}
          disabled={isLoading}
          className={`
            relative w-full p-6 rounded-xl shadow-md border text-white text-lg font-semibold transform transition-all duration-150
            bg-gradient-to-br ${d.color}
            hover:scale-105 hover:shadow-xl active:scale-95
            ${active === d.key ? "ring-4 ring-white ring-offset-2" : ""}
            ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
          aria-pressed={active === d.key}
        >
          <span className="block">{d.label}</span>
          {active === d.key && <div className="absolute inset-0 rounded-xl bg-white/10 pointer-events-none" />}
        </button>
      ))}
    </div>
  );
}
