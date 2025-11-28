// src/pages/Home.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import DifficultySelector from "../components/DifficultySelector.jsx";
import { QuizContext } from "../context/QuizContext.jsx";

export default function Home() {
  const navigate = useNavigate();
  const { setDifficulty } = useContext(QuizContext);

  const handleDifficultySelect = (levelKey) => {
    // set context and persist (QuizContext already persists difficulty to localStorage)
    setDifficulty?.(levelKey);

    // navigate to quiz page (your Quiz reads localStorage/context)
    navigate("/quiz");
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold">Welcome to CyberAware</h1>
        <p className="text-slate-600 mt-2">Learn cybersecurity through short quizzes. Choose difficulty and start your journey.</p>
      </div>

      <DifficultySelector onSelect={handleDifficultySelect} />
    </div>
  );
}
