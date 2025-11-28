// src/pages/Quiz.jsx
import React, { useContext, useEffect, useState } from "react";
import { QuizContext } from "../context/QuizContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Quiz() {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  let ctx = null;
  try {
    ctx = useContext(QuizContext);
  } catch {
    ctx = null;
  }

  const [difficulty, setDifficulty] = useState(
    ctx?.difficulty || localStorage.getItem("selected_difficulty")
  );
  const [questions, setQuestions] = useState(ctx?.questions || []);
  const [index, setIndex] = useState(ctx?.index || 0);
  const [score, setScore] = useState(ctx?.score || 0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // load static questions
  useEffect(() => {
    if (!difficulty) {
      navigate("/");
      return;
    }

    async function loadStatic() {
      try {
        const file = `/src/data/${difficulty}.json`;
        const res = await fetch(file);
        if (!res.ok) throw new Error("File not found");
        const data = await res.json();
        setQuestions(data);
        ctx?.setQuestions?.(data);
      } catch (err) {
        console.error("Failed to load static questions:", err);
      }
    }

    if (questions.length === 0) {
      loadStatic();
    }
  }, [difficulty]);

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold">No questions loaded</h2>
        <p className="text-gray-600 mt-2">Try selecting difficulty again.</p>
      </div>
    );
  }

  const q = questions[index];

  function handleSelect(option) {
    if (selected) return;

    setSelected(option);
    setShowExplanation(true);

    const correct = q.correct_answer.toLowerCase().trim();
    if (option.toLowerCase().trim() === correct) {
      const newScore = score + (q.points || 5);
      setScore(newScore);
      ctx?.setScore?.(newScore);
    }
  }

  async function submitToBackend(finalScore) {
    try {
      const entry = {
        username: user?.username || user?.email || "Anonymous",
        difficulty,
        score: finalScore,
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/leaderboard/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // IMPORTANT: send JWT
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(entry),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to submit score:", text);
      }
    } catch (err) {
      console.error("Error submitting score:", err);
    }
  }

  async function nextQuestion() {
    setSelected(null);
    setShowExplanation(false);

    if (index + 1 >= questions.length) {
      // quiz finished
      await submitToBackend(score);
      navigate("/certificate");
      return;
    }

    const newIndex = index + 1;
    setIndex(newIndex);
    ctx?.setIndex?.(newIndex);
  }

  const isCorrect = (opt) =>
    opt.toLowerCase().trim() === q.correct_answer.toLowerCase().trim();

  return (
    <div className="max-w-2xl mx-auto mt-10 card p-6">
      <h2 className="text-2xl font-semibold">
        Question {index + 1} / {questions.length}
      </h2>

      <p className="text-gray-600 mb-4">Difficulty: {difficulty}</p>

      <h3 className="text-lg font-semibold">{q.question}</h3>

      <div className="space-y-3 mt-6">
        {["A", "B", "C", "D"].map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            disabled={selected}
            className={`
              w-full text-left px-4 py-3 border rounded-lg
              ${
                selected
                  ? isCorrect(opt)
                    ? "bg-green-100 border-green-600"
                    : selected === opt
                    ? "bg-red-100 border-red-600"
                    : "bg-gray-100"
                  : "hover:bg-gray-100"
              }
            `}
          >
            <strong>{opt}.</strong> {q.options[opt]}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="font-semibold">Explanation:</p>
          <p>{q.explanation}</p>
          <p className="font-semibold mt-2">Tip:</p>
          <p>{q.tip}</p>
        </div>
      )}

      <button
        onClick={nextQuestion}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-6 hover:bg-indigo-700"
      >
        {index + 1 === questions.length ? "Finish" : "Next"}
      </button>
    </div>
  );
}
