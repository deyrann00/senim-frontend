import React, { useState } from "react";
import { quizzes, COLORS } from "../data";

function DiffBadge({ level }) {
  const map = { "Бастапқы": ["#d1fae5", "#065f46"], "Орташа": ["#fef3c7", "#92400e"], "Жоғары": ["#fee2e2", "#991b1b"] };
  const [bg, c] = map[level] || map["Бастапқы"];
  return <span style={{ background: bg, color: c, fontSize: 11, fontWeight: 500, padding: "2px 9px", borderRadius: 20 }}>{level}</span>;
}

export default function AcademyPage() {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const startQuiz = (quiz) => { setActiveQuiz(quiz); setQIndex(0); setSelected(null); setConfirmed(false); setAnswers([]); setFinished(false); };
  const confirm = () => { if (selected !== null) { setConfirmed(true); setAnswers(prev => [...prev, selected]); } };
  const next = () => { if (qIndex + 1 >= activeQuiz.questions.length) setFinished(true); else { setQIndex(i => i + 1); setSelected(null); setConfirmed(false); } };

  const score = finished ? Math.round((answers.filter((a, i) => a === activeQuiz.questions[i].answer).length / activeQuiz.questions.length) * 100) : 0;

  if (activeQuiz && finished) {
    return (
      <div style={{ maxWidth: 560, margin: "4rem auto", padding: "0 1.25rem", textAlign: "center" }}>
        <div style={{ background: "white", border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "3rem 2rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1.5rem", color: COLORS.blue, marginBottom: 6 }}>Қауіпсіздік көрсеткішіңіз</h2>
            <span style={{ fontSize: 28, fontWeight: 800 }}>{score}%</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => startQuiz(activeQuiz)} style={{ background: COLORS.blue, color: "white", border: "none", borderRadius: 10, padding: "0.7rem", fontWeight: 600, cursor: "pointer", fontSize: 15 }}>Қайта тапсыру</button>
            <button onClick={() => setActiveQuiz(null)} style={{ background: "none", border: `1.5px solid ${COLORS.border}`, borderRadius: 10, padding: "0.7rem", fontWeight: 500, cursor: "pointer", fontSize: 15, color: COLORS.blue }}>Академияға оралу</button>
          </div>
        </div>
      </div>
    );
  }

  if (activeQuiz) {
    const q = activeQuiz.questions[qIndex];
    return (
      <div style={{ maxWidth: 600, margin: "3rem auto", padding: "0 1.25rem" }}>
        <button onClick={() => setActiveQuiz(null)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.gray, marginBottom: "1.5rem" }}>← Тесттерге оралу</button>
        <div style={{ background: "white", border: `1px solid ${COLORS.border}`, borderRadius: 18, padding: "2rem" }}>
          <h3 style={{ fontWeight: 600, fontSize: 17, color: COLORS.blue, marginBottom: "1.5rem" }}>{q.q}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.5rem" }}>
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => !confirmed && setSelected(i)} style={{ background: selected === i ? COLORS.blueLight : "white", border: `2px solid ${selected === i ? COLORS.blue : COLORS.border}`, borderRadius: 10, padding: "0.85rem 1rem", textAlign: "left", cursor: confirmed ? "default" : "pointer", fontSize: 14 }}>
                {opt}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {!confirmed ? <button onClick={confirm} disabled={selected === null} style={{ background: selected !== null ? COLORS.blue : COLORS.gray, color: "white", border: "none", borderRadius: 10, padding: "0.7rem 1.75rem", cursor: "pointer" }}>Жауапты растау</button>
              : <button onClick={next} style={{ background: COLORS.green, color: "white", border: "none", borderRadius: 10, padding: "0.7rem 1.75rem", cursor: "pointer" }}>Келесі сұрақ</button>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section style={{ background: COLORS.blue, padding: "3rem 1.25rem 2.5rem", textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Қауіпсіздік Академиясы</h1>
        <p style={{ opacity: 0.8 }}>Біліміңізді тексеріп, Қауіпсіздік көрсеткішіңізді алыңыз</p>
      </section>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2.5rem 1.25rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {quizzes.map(q => (
            <div key={q.id} style={{ background: "white", border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 16, color: COLORS.blue, margin: 0 }}>{q.title}</h3>
                  <DiffBadge level={q.difficulty} />
                </div>
              </div>
              <button onClick={() => startQuiz(q)} style={{ background: COLORS.blue, color: "white", border: "none", borderRadius: 10, padding: "0.65rem 1.5rem", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                Бастау
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
