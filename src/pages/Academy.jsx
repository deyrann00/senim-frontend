import React, { useState, useEffect } from "react";
// Make sure we import QUIZZES from constants where you added the Russian translations!
import { QUIZZES } from "../config/constants";
import { COLORS } from "../data";

function DiffBadge({ level }) {
  const map = {
    "Бастапқы": ["#d1fae5", "#065f46"], "Начальный": ["#d1fae5", "#065f46"],
    "Орташа": ["#fef3c7", "#92400e"], "Средний": ["#fef3c7", "#92400e"],
    "Жоғары": ["#fee2e2", "#991b1b"], "Высокий": ["#fee2e2", "#991b1b"]
  };
  const [bg, c] = map[level] || map["Бастапқы"];
  return <span style={{ background: bg, color: c, fontSize: 11, fontWeight: 500, padding: "2px 9px", borderRadius: 20 }}>{level}</span>;
}

export default function AcademyPage({ t, lang = "kz", setSafetyScore }) {
  const act = t?.academy || {};

  // We can figure out if it's Russian by checking the translation file
  const isRu = act.start === "Начать" || lang === "ru";

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const startQuiz = (quiz) => { setActiveQuiz(quiz); setQIndex(0); setSelected(null); setConfirmed(false); setAnswers([]); setFinished(false); };

  const confirm = () => {
    if (selected !== null) {
      setConfirmed(true);
      setAnswers(prev => [...prev, selected]);
    }
  };

  const next = () => {
    if (qIndex + 1 >= activeQuiz.questions.length) {
      setFinished(true);
    } else {
      setQIndex(i => i + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  // Calculate score
  const score = finished ? Math.round((answers.filter((a, i) => a === activeQuiz.questions[i].answer).length / activeQuiz.questions.length) * 100) : 0;

  // Save score to local storage when finished
  useEffect(() => {
    if (finished && activeQuiz) {
      try {
        const saved = JSON.parse(localStorage.getItem("senimwiki_scores") || "{}");
        saved[`senimwiki_quiz_${activeQuiz.id}`] = score;
        localStorage.setItem("senimwiki_scores", JSON.stringify(saved));

        // Optional: Update the global state so the Navbar changes immediately
        if (setSafetyScore) {
          const all = QUIZZES.map(q => saved[`senimwiki_quiz_${q.id}`] ?? 0);
          setSafetyScore(Math.round(all.reduce((a,b)=>a+b,0)/all.length));
        }
      } catch (e) {
        console.error("Could not save score", e);
      }
    }
  }, [finished, activeQuiz, score, setSafetyScore]);

  if (activeQuiz && finished) {
    return (
        <div style={{ maxWidth: 560, margin: "4rem auto", padding: "0 1.25rem", textAlign: "center" }}>
          <div style={{ background: "white", border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "3rem 2rem" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.5rem", color: COLORS.blue, marginBottom: 6 }}>{act.scoreTitle || "Қауіпсіздік көрсеткішіңіз"}</h2>
              <span style={{ fontSize: 28, fontWeight: 800 }}>{score}%</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={() => startQuiz(activeQuiz)} style={{ background: COLORS.blue, color: "white", border: "none", borderRadius: 10, padding: "0.7rem", fontWeight: 600, cursor: "pointer", fontSize: 15 }}>
                {act.retry || "Қайта тапсыру"}
              </button>
              <button onClick={() => setActiveQuiz(null)} style={{ background: "none", border: `1.5px solid ${COLORS.border}`, borderRadius: 10, padding: "0.7rem", fontWeight: 500, cursor: "pointer", fontSize: 15, color: COLORS.blue }}>
                {act.backToList || "Академияға оралу"}
              </button>
            </div>
          </div>
        </div>
    );
  }

  if (activeQuiz) {
    const q = activeQuiz.questions[qIndex];

    // Choose the right language string for the current question
    const questionText = isRu && q.qRu ? q.qRu : q.q;
    const optionsList = isRu && q.optionsRu ? q.optionsRu : q.options;

    return (
        <div style={{ maxWidth: 600, margin: "3rem auto", padding: "0 1.25rem" }}>
          <button onClick={() => setActiveQuiz(null)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.gray, marginBottom: "1.5rem" }}>
            {act.back || "← Тесттерге оралу"}
          </button>
          <div style={{ background: "white", border: `1px solid ${COLORS.border}`, borderRadius: 18, padding: "2rem" }}>
            <h3 style={{ fontWeight: 600, fontSize: 17, color: COLORS.blue, marginBottom: "1.5rem" }}>{questionText}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.5rem" }}>
              {optionsList.map((opt, i) => (
                  <button key={i} onClick={() => !confirmed && setSelected(i)} style={{ background: selected === i ? COLORS.blueLight : "white", border: `2px solid ${selected === i ? COLORS.blue : COLORS.border}`, borderRadius: 10, padding: "0.85rem 1rem", textAlign: "left", cursor: confirmed ? "default" : "pointer", fontSize: 14 }}>
                    {opt}
                  </button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {!confirmed ? (
                  <button onClick={confirm} disabled={selected === null} style={{ background: selected !== null ? COLORS.blue : COLORS.gray, color: "white", border: "none", borderRadius: 10, padding: "0.7rem 1.75rem", cursor: "pointer" }}>
                    {act.confirm || "Жауапты растау"}
                  </button>
              ) : (
                  <button onClick={next} style={{ background: COLORS.green, color: "white", border: "none", borderRadius: 10, padding: "0.7rem 1.75rem", cursor: "pointer" }}>
                    {act.next || "Келесі сұрақ"}
                  </button>
              )}
            </div>
          </div>
        </div>
    );
  }

  return (
      <div>
        <section style={{ background: COLORS.blue, padding: "3rem 1.25rem 2.5rem", textAlign: "center", color: "white" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>{act.title || "Қауіпсіздік Академиясы"}</h1>
          <p style={{ opacity: 0.8 }}>{act.sub || "Біліміңізді тексеріп, Қауіпсіздік көрсеткішіңізді алыңыз"}</p>
        </section>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "2.5rem 1.25rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {QUIZZES.map(q => {
              // Pick the right title and difficulty based on language
              const quizTitle = isRu && q.titleRu ? q.titleRu : q.title;
              const quizDiff = isRu && q.difficultyRu ? q.difficultyRu : q.difficulty;

              return (
                  <div key={q.id} style={{ background: "white", border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <h3 style={{ fontWeight: 700, fontSize: 16, color: COLORS.blue, margin: 0 }}>{quizTitle}</h3>
                        <DiffBadge level={quizDiff} />
                      </div>
                    </div>
                    <button onClick={() => startQuiz(q)} style={{ background: COLORS.blue, color: "white", border: "none", borderRadius: 10, padding: "0.65rem 1.5rem", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                      {act.start || "Бастау"}
                    </button>
                  </div>
              );
            })}
          </div>
        </div>
      </div>
  );
}