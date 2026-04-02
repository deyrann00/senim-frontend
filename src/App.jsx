import React, { useState } from "react";
import { TRANSLATIONS, QUIZZES } from "./config/constants";
import { Navbar, Footer } from "./components/Layout";
import HomePage from "./pages/Home";
import WikiPage from "./pages/Wiki";
import AcademyPage from "./pages/Academy";
import BlacklistPage from "./pages/Blacklist";
import AboutPage from "./pages/About";
import "./index.css"; // Импорт шрифта и анимаций

export default function App() {
  const [page, setPage] = useState("home");
  const [lang, setLang] = useState("kz");
  const t = TRANSLATIONS[lang];

  const [safetyScore, setSafetyScore] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("senimwiki_scores") || "{}");
      const all = QUIZZES.map(q => saved[`senimwiki_quiz_${q.id}`] ?? 0);
      return Math.round(all.reduce((a,b)=>a+b,0)/all.length);
    } catch { return 0; }
  });

  const [scannerState, setScannerState] = useState({
    mode:"text", text:"", file:null, result:null, loading:false,
    isDragging:false, ocrProgress:0, previewText:"", showPreview:false,
  });

  const renderPage = () => {
    switch(page) {
      case "home": return <HomePage setPage={setPage} t={t} scannerState={scannerState} setScannerState={setScannerState}/>;
      case "wiki": return <WikiPage t={t}/>;
      case "academy": return <AcademyPage t={t} safetyScore={safetyScore} setSafetyScore={setSafetyScore}/>;
      case "blacklist": return <BlacklistPage t={t}/>;
      case "about": return <AboutPage t={t}/>;
      default: return <HomePage setPage={setPage} t={t} scannerState={scannerState} setScannerState={setScannerState}/>;
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <Navbar page={page} setPage={setPage} lang={lang} setLang={setLang} t={t} safetyScore={safetyScore}/>
      <main style={{ flex:1 }}>{renderPage()}</main>
      <Footer t={t}/>
    </div>
  );
}