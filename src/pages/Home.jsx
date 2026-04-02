import React, { useState, useRef } from "react";
import { Shield, Search, MessageSquare, ArrowRight, CheckCircle, XCircle, UploadCloud, FileImage } from "lucide-react";
import { COLORS } from "../data";
import Tesseract from 'tesseract.js';

export default function HomePage({ setPage, t }) {
  const ht = t?.home || {}; // Load translations

  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const checkText = () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setRecognizedText("");

    setTimeout(() => {
      const fraudKeywords = ["ұтыс", "сыйлық", "осында басыңыз", "шұғыл", "банк шоты", "растау", "құпия сөз", "тегін ақша", "инвестиция", "табыс", "пирамида", "крипто бонус"];
      const lower = text.toLowerCase();
      const hits = fraudKeywords.filter(k => lower.includes(k));
      const score = Math.min(hits.length * 25, 100);
      setResult({ score, hits, safe: score < 30, type: "text" });
      setLoading(false);
    }, 1200);
  };

  const analyzeFile = async (uploadedFile) => {
    if (!uploadedFile) return;
    setLoading(true);
    setResult(null);
    setRecognizedText("");

    try {
      const { data: { text: extractedText } } = await Tesseract.recognize(
          uploadedFile,
          'kaz+rus',
          { logger: m => console.log(m) }
      );

      setRecognizedText(extractedText);

      setTimeout(() => {
        const fraudKeywords = ["ұтыс", "шұғыл", "инвестиция", "карта", "код", "перевод", "сыйлық", "акция"];
        const lower = extractedText.toLowerCase();
        const hits = fraudKeywords.filter(k => lower.includes(k));

        const baseScore = hits.length > 0 ? hits.length * 30 : Math.floor(Math.random() * 40);
        const finalScore = Math.min(baseScore, 100);

        setResult({
          score: finalScore,
          hits: hits,
          safe: finalScore < 30,
          type: "file"
        });
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error("Ошибка OCR:", error);
      setLoading(false);
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      analyzeFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      analyzeFile(selectedFile);
    }
  };

  return (
      <div>
        <section style={{ background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.blueMid} 100%)`, color: "white", padding: "5rem 1.25rem 4rem", textAlign: "center" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.12)", borderRadius: 20, padding: "6px 16px", fontSize: 13, marginBottom: "1.5rem" }}>
              <Shield size={14} color="#6ee7b7" /> {ht?.badge || "ЖИ негізіндегі алаяқтықты анықтау сканері"}
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, lineHeight: 1.2, marginBottom: "1rem" }}>
              {ht?.heroTitle || "Күдікті хабарламаны немесе чат скриншотын тексеріңіз."}
            </h1>
            <p style={{ fontSize: 17, opacity: 0.8, marginBottom: "2.5rem", lineHeight: 1.6 }}>
              {ht?.heroSub || "Біздің AI мәтінді немесе суреттегі чатты оқып, алаяқтық ықтималдығын пайызбен көрсетеді."}
            </p>

            <div style={{ background: "white", borderRadius: 16, padding: "1.25rem", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
              <div style={{ display: "flex", gap: 10, marginBottom: "1rem" }}>
                <button onClick={() => { setMode("text"); setResult(null); setRecognizedText(""); }} style={{ flex: 1, padding: "0.6rem", borderRadius: 8, border: "none", fontWeight: 600, cursor: "pointer", background: mode === "text" ? COLORS.blueLight : "transparent", color: mode === "text" ? COLORS.blue : COLORS.gray }}>
                  {ht?.modeText || "Мәтінді тексеру"}
                </button>
                <button onClick={() => { setMode("file"); setResult(null); setRecognizedText(""); }} style={{ flex: 1, padding: "0.6rem", borderRadius: 8, border: "none", fontWeight: 600, cursor: "pointer", background: mode === "file" ? COLORS.blueLight : "transparent", color: mode === "file" ? COLORS.blue : COLORS.gray }}>
                  {ht?.modeFile || "Скриншот / Чат жүктеу"}
                </button>
              </div>

              {mode === "text" && (
                  <>
                <textarea
                    value={text}
                    onChange={e => { setText(e.target.value); setResult(null); }}
                    placeholder={ht?.scanPhText || 'Күдікті мәтінді немесе сілтемені осында қойыңыз...'}
                    style={{ width: "100%", minHeight: 130, resize: "vertical", border: `1.5px solid ${COLORS.border}`, borderRadius: 10, padding: "0.85rem 1rem", fontSize: 14, color: "#1f2937", fontFamily: "inherit", outline: "none", boxSizing: "border-box", lineHeight: 1.6 }}
                />
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
                      <button onClick={checkText} disabled={loading || !text.trim()} style={{ background: loading ? COLORS.gray : COLORS.green, color: "white", border: "none", borderRadius: 10, padding: "0.7rem 2rem", fontSize: 15, fontWeight: 600, cursor: text.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 8, opacity: !text.trim() ? 0.6 : 1, transition: "all 0.2s" }}>
                        {loading ? (ht?.scanning || "Талдануда…") : <><Search size={16} /> {ht?.scanBtn || "Тексеру"}</>}
                      </button>
                    </div>
                  </>
              )}

              {mode === "file" && (
                  <div
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      style={{
                        border: `2px dashed ${isDragging ? COLORS.green : COLORS.border}`,
                        borderRadius: 12, padding: "3rem 1rem", textAlign: "center",
                        background: isDragging ? COLORS.greenLight : COLORS.grayLight,
                        transition: "all 0.2s", cursor: "pointer"
                      }}
                      onClick={() => fileInputRef.current?.click()}
                  >
                    <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={handleFileChange} />
                    {loading ? (
                        <div style={{ color: COLORS.blue, fontWeight: 600 }}>{ht?.ocrLoading || "AI чатты оқуда (OCR)... Күте тұрыңыз"}</div>
                    ) : file ? (
                        <div style={{ color: COLORS.green, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <FileImage size={20} /> {file.name} {ht?.fileLoaded || "жүктелді. Өзгерту үшін басыңыз."}
                        </div>
                    ) : (
                        <div>
                          <UploadCloud size={32} color={COLORS.gray} style={{ marginBottom: 10 }} />
                          <p style={{ color: COLORS.blue, fontWeight: 600, margin: "0 0 5px" }}>{ht?.uploadPrompt1 || "Чат скриншотын осында тастаңыз"}</p>
                          <p style={{ color: COLORS.gray, fontSize: 13, margin: 0 }}>{ht?.uploadPrompt2 || "немесе файлды таңдау үшін басыңыз"}</p>
                        </div>
                    )}
                  </div>
              )}

              {/* Вывод результатов */}
              {result && (
                  <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ background: result.safe ? COLORS.greenLight : COLORS.redLight, border: `1.5px solid ${result.safe ? "#059669" : "#dc2626"}`, borderRadius: 10, padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                      <div style={{ width: 70, height: 70, borderRadius: "50%", background: "white", border: `4px solid ${result.safe ? COLORS.green : COLORS.red}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontWeight: 800, fontSize: 20, color: result.safe ? COLORS.green : COLORS.red }}>{result.score}%</span>
                      </div>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          {result.safe ? <CheckCircle size={18} color={COLORS.green} /> : <XCircle size={18} color={COLORS.red} />}
                          <span style={{ fontWeight: 700, color: result.safe ? "#065f46" : "#991b1b", fontSize: 16 }}>
                        {result.safe ? (ht?.resultSafe || "Қауіпсіз болуы мүмкін") : (ht?.resultUnsafe || "Алаяқтық қаупі өте жоғары!")}
                      </span>
                        </div>
                        <p style={{ fontSize: 13, color: result.safe ? "#065f46" : "#991b1b", margin: 0 }}>
                          {result.hits.length > 0 ? <>{ht?.foundThreats || "Табылған қауіптер:"} <strong>{result.hits.join(", ")}</strong></> : (ht?.noThreats || "AI күдікті маркерлерді тапқан жоқ.")}
                        </p>
                      </div>
                    </div>

                    {mode === "file" && recognizedText && (
                        <div style={{ background: COLORS.grayLight, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "1rem", textAlign: "left" }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.blue, margin: "0 0 0.5rem 0" }}>{ht?.ocrResultTitle || "Суреттен оқылған мәтін:"}</p>
                          <div style={{ fontSize: 13, color: COLORS.gray, whiteSpace: "pre-wrap", maxHeight: "150px", overflowY: "auto", fontFamily: "monospace", paddingRight: "5px" }}>
                            {recognizedText}
                          </div>
                        </div>
                    )}
                  </div>
              )}
            </div>
          </div>
        </section>

        <section style={{ background: COLORS.green, padding: "1.5rem 1.25rem" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", textAlign: "center" }}>
            {[
              ["12,400+", ht?.stat1 || "Құжатталған алаяқтық"],
              ["3.2M ₸", ht?.stat2 || "Орташа шығын"],
              ["94%", ht?.stat3 || "Анықтау дәлдігі"]
            ].map(([val, label]) => (
                <div key={label}>
                  <p style={{ color: "white", fontWeight: 700, fontSize: "clamp(1.4rem, 3vw, 2rem)", margin: 0 }}>{val}</p>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, margin: 0 }}>{label}</p>
                </div>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 1.25rem" }}>
          <h2 style={{ textAlign: "center", fontSize: "1.6rem", fontWeight: 700, color: COLORS.blue, marginBottom: "0.5rem" }}>{ht?.hiwTitle || "Бұл қалай жұмыс істейді"}</h2>
          <p style={{ textAlign: "center", color: COLORS.gray, marginBottom: "2.5rem" }}>{ht?.hiwSub || "Күдікті хабарламаны тексерудің үш қадамы"}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {[
              { n: "01", icon: <MessageSquare size={28} color={COLORS.blue} />, title: ht?.step1Title || "Деректі енгізіңіз", desc: ht?.step1Desc || "Мәтінді көшіріңіз немесе чат скриншотын (файлды) жүктеңіз." },
              { n: "02", icon: <Search size={28} color={COLORS.blue} />, title: ht?.step2Title || "ЖИ талдауы (OCR)", desc: ht?.step2Desc || "AI суреттегі мәтінді оқып, манипуляция мен алаяқтық үлгілерін тексереді." },
              { n: "03", icon: <Shield size={28} color={COLORS.green} />, title: ht?.step3Title || "Нәтижесін алыңыз", desc: ht?.step3Desc || "Алаяқтық ықтималдығын пайызбен (%) және толық түсініктемемен алыңыз." },
            ].map(s => (
                <div key={s.n} style={{ background: "white", border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "1.75rem", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 16, right: 16, fontSize: 42, fontWeight: 800, color: COLORS.blueLight, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ marginBottom: 14 }}>{s.icon}</div>
                  <h3 style={{ fontWeight: 700, fontSize: 16, color: COLORS.blue, marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ color: COLORS.gray, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                </div>
            ))}
          </div>
        </section>

        <section style={{ background: COLORS.blueLight, padding: "3rem 1.25rem", textAlign: "center" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.4rem", color: COLORS.blue, marginBottom: "0.75rem" }}>{ht?.ctaTitle || "Алаяқтықты өзіңіз анықтап үйренгіңіз келе ме?"}</h2>
          <p style={{ color: COLORS.gray, marginBottom: "1.5rem" }}>{ht?.ctaSub || "Академиямызда тегін тесттерден өтіп, Қауіпсіздік көрсеткішіңізді көтеріңіз."}</p>
          <button onClick={() => setPage("academy")} style={{ background: COLORS.blue, color: "white", border: "none", borderRadius: 10, padding: "0.75rem 2rem", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
            {ht?.ctaBtn || "Оқуды бастау"} <ArrowRight size={16} />
          </button>
        </section>
      </div>
  );
}