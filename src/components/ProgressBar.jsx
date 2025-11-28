import React from "react";

export default function ProgressBar({ current, total }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div>
      <div className="text-sm text-slate-600 mb-1">Progress: {current}/{total}</div>
      <div className="w-full bg-slate-200 h-3 rounded">
        <div className="h-3 rounded bg-indigo-500" style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}
