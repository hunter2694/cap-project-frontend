// src/pages/CertificatePage.jsx
import React, { useContext, useEffect, useState } from "react";
import Certificate from "../components/Certificate.jsx";
import { QuizContext } from "../context/QuizContext.jsx";

export default function CertificatePage() {
  const quizCtx = useContext(QuizContext);

  // prefer context values if present
  const ctxScore = quizCtx?.score;
  const ctxQuestions = quizCtx?.questions;
  const ctxDifficulty = quizCtx?.difficulty;

  const [score, setScore] = useState(null);
  const [total, setTotal] = useState(null);
  const [difficulty, setDifficulty] = useState(ctxDifficulty || "");
  const [name, setName] = useState("Player");

  useEffect(() => {
    // load user display name from local storage user object (same key you use)
    const raw = localStorage.getItem("cyberaware_user") || localStorage.getItem("user_name") || localStorage.getItem("user_email");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setName(parsed?.username || parsed?.email || String(raw) || "Player");
      } catch {
        // raw might be a string like email - take it
        setName(raw);
      }
    }

    // 1) Try QuizContext first
    if (typeof ctxScore === "number" && Array.isArray(ctxQuestions) && ctxQuestions.length > 0) {
      const computedTotal = ctxQuestions.reduce((s, q) => s + (Number.isFinite(q?.points) ? q.points : 0), 0);
      setScore(ctxScore);
      setTotal(computedTotal);
      setDifficulty(ctxDifficulty || localStorage.getItem("last_difficulty") || "");
      console.debug("CertificatePage: using QuizContext values", { ctxScore, computedTotal, ctxDifficulty });
      return;
    }

    // 2) Fallback to explicit last stored values (set by Quiz when finishing)
    const lsScore = localStorage.getItem("last_score");
    const lsTotal = localStorage.getItem("last_total");
    const lsDifficulty = localStorage.getItem("last_difficulty");

    if (lsScore !== null && lsTotal !== null) {
      const s = Number(lsScore) || 0;
      const t = Number(lsTotal) || 0;
      setScore(s);
      setTotal(t);
      setDifficulty(lsDifficulty || difficulty);
      console.debug("CertificatePage: using localStorage last_score/last_total", { s, t, lsDifficulty });
      return;
    }

    // 3) Another fallback — compute total from stored question bank `quiz_questions` (if you kept it)
    const quizRaw = localStorage.getItem("quiz_questions");
    if (quizRaw) {
      try {
        const parsedQs = JSON.parse(quizRaw);
        if (Array.isArray(parsedQs) && parsedQs.length > 0) {
          const computedTotal = parsedQs.reduce((s, q) => s + (Number.isFinite(q?.points) ? q.points : 0), 0);
          setTotal(computedTotal);
          // score might still be missing, set 0 to avoid null/undefined
          setScore( Number(localStorage.getItem("last_score")) || 0 );
          setDifficulty(localStorage.getItem("last_difficulty") || difficulty);
          console.debug("CertificatePage: computed total from quiz_questions", { computedTotal });
          return;
        }
      } catch (e) {
        console.warn("CertificatePage: failed parse quiz_questions:", e);
      }
    }

    // 4) Last resort: zero values
    setScore(Number(localStorage.getItem("last_score")) || 0);
    setTotal(0);
    setDifficulty(localStorage.getItem("last_difficulty") || difficulty);
    console.debug("CertificatePage: fallback zeros", {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctxScore, ctxQuestions, ctxDifficulty]);

  // If still null, show loading-ish placeholder
  if (score === null || total === null) {
    return (
      <div className="card p-6 text-center">
        <p className="text-slate-600">Loading certificate…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2 className="text-xl font-semibold">Your Certificate</h2>
        <div className="mt-4">
          <Certificate
            name={name}
            difficulty={difficulty || "N/A"}
            score={score}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
