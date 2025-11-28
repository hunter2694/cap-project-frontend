const templates = {
  Beginner: [
    {
      type: "mcq",
      q: "Which of the following is the best practice for creating a strong password?",
      options: [
        "Use only your birthdate",
        "Use a mix of letters, numbers, and symbols",
        "Use 'password' for easy recall",
        "Use the same password for all sites"
      ],
      correct: "B",
      explanation: "Strong passwords include a mix of upper/lowercase letters, numbers and symbols and are not easily guessable.",
      tip: "Use a passphrase or a password manager to generate and store strong passwords.",
      points: 10
    }
  ],
  Intermediate: [
    {
      type: "mcq",
      q: "Which of the following is a benefit of enabling multi-factor authentication (MFA)?",
      options: [
        "Slower login experience only",
        "An additional barrier even if a password is compromised",
        "Removes need for passwords",
        "Makes passwords detectable"
      ],
      correct: "B",
      explanation: "MFA adds an additional verification step (like a code), protecting the account even if the password is stolen.",
      tip: "Use authenticator apps or hardware tokens rather than SMS when possible.",
      points: 20
    }
  ],
  Expert: [
    {
      type: "mcq",
      q: "What is the primary purpose of network segmentation in an enterprise environment?",
      options: [
        "Simplify IP addressing",
        "Improve security by isolating and limiting lateral movement",
        "Reduce hardware costs",
        "Enable single sign-on"
      ],
      correct: "B",
      explanation: "Segmentation isolates resources so if one part is compromised, attackers find it harder to move laterally.",
      tip: "Use VLANs, firewalls, and access controls to enforce segmentation.",
      points: 30
    }
  ]
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function cloneAndAssign(qObj, idx, source) {
  const opts = qObj.options.map((o, i) => ({ key: String.fromCharCode(65 + i), text: o }));
  const shuffled = shuffleArray(opts);
  const originalIndex = qObj.correct ? ["A", "B", "C", "D"].indexOf(qObj.correct) : null;
  let correctLetter;
  if (originalIndex !== null && originalIndex >= 0) {
    const correctText = qObj.options[originalIndex];
    for (const o of shuffled) {
      if (o.text === correctText) {
        correctLetter = o.key;
        break;
      }
    }
  } else {
    correctLetter = qObj.correct || "A";
  }
  const id = `${source}-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`;
  return {
    id,
    type: qObj.type,
    question: qObj.q,
    options: {
      A: shuffled[0] ? shuffled[0].text : "",
      B: shuffled[1] ? shuffled[1].text : "",
      C: shuffled[2] ? shuffled[2].text : "",
      D: shuffled[3] ? shuffled[3].text : ""
    },
    correct_answer: correctLetter,
    explanation: qObj.explanation,
    tip: qObj.tip,
    points: qObj.points || 10
  };
}

export function generateQuestions(difficulty = "Beginner", count = 15) {
  const pool = templates[difficulty] || templates.Beginner;
  const out = [];
  let idx = 0;
  while (out.length < count) {
    const template = pool[idx % pool.length];
    out.push(cloneAndAssign(template, idx, difficulty.toLowerCase()));
    idx++;
  }
  return out;
}
