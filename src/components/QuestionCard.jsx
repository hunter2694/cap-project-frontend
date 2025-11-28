import React, { useState } from "react";

export default function QuestionCard({ q, onAnswer }) {
  // q: { id, type, question, options: {A..D}, correct_answer, explanation, tip, points }
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const select = (letter) => {
    if (revealed) return;
    setSelected(letter);
    setRevealed(true);
    const correct = letter === q.correct_answer;
    onAnswer({ correct, selected: letter, points: correct ? q.points : 0 });
  };

  const renderOption = (letter) => {
    const txt = q.options[letter];
    const isSelected = selected === letter;
    const isCorrect = q.correct_answer === letter;
    let classes = "border rounded p-3 cursor-pointer";
    if (revealed) {
      if (isCorrect) classes += " border-green-500 bg-green-50";
      else if (isSelected && !isCorrect) classes += " border-red-500 bg-red-50";
      else classes += " opacity-90";
    } else {
      classes += " hover:bg-slate-50";
    }
    return (
      <div key={letter} className={classes} onClick={() => select(letter)}>
        <div className="font-semibold">{letter}. {txt}</div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-sm text-slate-500">Type: {q.type.toUpperCase()}</div>
          <h3 className="text-lg font-semibold mt-1">{q.question}</h3>
        </div>
        <div className="text-sm text-slate-700">Points: {q.points}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {["A", "B", "C", "D"].map(renderOption)}
      </div>

      {revealed && (
        <div className="mt-4 p-4 border rounded bg-slate-50">
          <div className="font-semibold">Explanation</div>
          <div className="text-sm mt-1">{q.explanation}</div>
          <div className="font-semibold mt-2">Tip</div>
          <div className="text-sm mt-1">{q.tip}</div>
        </div>
      )}
    </div>
  );
}
