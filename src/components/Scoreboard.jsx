import React from "react";

export default function Scoreboard({ score, totalPossible }) {
  return (
    <div className="card">
      <div className="text-sm text-slate-500">Score</div>
      <div className="text-2xl font-bold">{score} / {totalPossible}</div>
    </div>
  );
}
