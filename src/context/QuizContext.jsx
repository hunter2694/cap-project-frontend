// src/context/QuizContext.jsx
import React, { createContext, useState, useEffect } from "react";

// Named export — REQUIRED for Quiz.jsx
export const QuizContext = createContext();

// Default export — so App.jsx can use <QuizProvider>
export default function QuizProvider({ children }) {
  const [difficulty, setDifficulty] = useState(
    () => localStorage.getItem("selected_difficulty") || null
  );

  const [questions, setQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem("quiz_questions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [index, setIndex] = useState(() => {
    const raw = localStorage.getItem("quiz_index");
    return raw ? Number(raw) : 0;
  });

  const [score, setScore] = useState(() => {
    const raw = localStorage.getItem("quiz_score");
    return raw ? Number(raw) : 0;
  });

  // Persist difficulty
  useEffect(() => {
    if (difficulty) {
      localStorage.setItem("selected_difficulty", difficulty);
    }
  }, [difficulty]);

  // Persist questions
  useEffect(() => {
    try {
      localStorage.setItem("quiz_questions", JSON.stringify(questions));
    } catch (e) {}
  }, [questions]);

  // Persist index & score
  useEffect(() => {
    localStorage.setItem("quiz_index", index);
  }, [index]);

  useEffect(() => {
    localStorage.setItem("quiz_score", score);
  }, [score]);

  // Reset quiz back to start (useful after certificate)
  const resetQuiz = () => {
    setIndex(0);
    setScore(0);
    setQuestions([]);
    localStorage.removeItem("quiz_index");
    localStorage.removeItem("quiz_score");
    localStorage.removeItem("quiz_questions");
  };

  return (
    <QuizContext.Provider
      value={{
        difficulty,
        setDifficulty,
        questions,
        setQuestions,
        index,
        setIndex,
        score,
        setScore,
        resetQuiz
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}
