import React, { useState, useRef } from "react";
import {
  Shield, ShieldAlert, Search, MessageSquare, ArrowRight,
  CheckCircle, XCircle, UploadCloud, FileImage, Eye, Brain
} from "lucide-react";
import { COLORS } from "../data";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// ─────────────────────────────────────────────
// ШАГ 1: OCR — Llama 4 Scout читает скриншот
// Принимает File, возвращает строку с текстом
// ─────────────────────────────────────────────
const extractTextFromImage = async (imageFile) => {
  const apiKey = process.env.REACT_APP_GROQ_API_KEY;

  // Конвертируем файл в base64
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = () => reject(new Error("Файлды оқу қатесі"));
    reader.readAsDataURL(imageFile);
  });

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct", // Vision модель — OCR
      temperature: 0.1,
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${imageFile.type};base64,${base64}` },
            },
            {
              type: "text",
              text: `Ты OCR-система. Прочитай ВЕСЬ текст на этом скриншоте максимально точно.
Сохрани оригинальный язык (казахский, русский или английский).
Верни ТОЛЬКО извлечённый текст, без комментариев и пояснений.`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Llama 4 Scout (OCR) қатесі ${response.status}: ${err?.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
};

// ─────────────────────────────────────────────
// ШАГ 2: АНАЛИЗ — Llama 3.3 анализирует текст
// Принимает строку, возвращает { score, hits, safe }
// ─────────────────────────────────────────────
const analyzeTextForFraud = async (inputText) => {
  const apiKey = process.env.REACT_APP_GROQ_API_KEY;

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile", // Мощная модель — глубокий анализ
      temperature: 0.1,
      max_tokens: 512,
      messages: [
        {
          role: "system",
          content: `Ты эксперт по кибербезопасности Казахстана. 
Анализируешь тексты на мошенничество: финансовые пирамиды, фишинг, вишинг, 
поддельные госвыплаты (42500 тенге, ЕНПФ, Минтруд), фейковые розыгрыши.
Отвечай ТОЛЬКО валидным JSON без markdown и пояснений.`,
        },
        {
          role: "user",
          content: `Проанализируй текст на мошенничество:

"""
${inputText}
"""

Ответ строго в JSON:
{
  "score": <число 0-100, процент риска>,
  "hits": ["конкретный триггер 1", "конкретный триггер 2"],
  "safe": <true если score < 30, иначе false>
}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Llama 3.3 (анализ) қатесі ${response.status}: ${err?.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const raw = data.choices[0].message.content.trim();
  const clean = raw.replace(/```json|```/gi, "").trim();
  const parsed = JSON.parse(clean);

  return {
    score: Number(parsed.score) || 0,
    hits: Array.isArray(parsed.hits) ? parsed.hits : [],
    safe: Boolean(parsed.safe ?? parsed.score < 30),
  };
};

// ─────────────────────────────────────────────
// КОМПОНЕНТ
// ─────────────────────────────────────────────
export default function HomePage({ setPage, t }) {
  const ht = t?.home || {};

  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(""); // "ocr" | "analysis"
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Анализ текста — только Llama 3.3
  const checkText = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setLoadingStage("analysis");
    setResult(null);

    try {
      const analysis = await analyzeTextForFraud(text);
      setResult({ ...analysis, type: "text" });
    } catch (error) {
      console.error("Анализ қатесі:", error);
      setResult({ score: 0, hits: [], safe: true, type: "text", error: error.message });
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  // Анализ файла — сначала Llama 4 Scout (OCR), потом Llama 3.3 (анализ)
  const analyzeFile = async (uploadedFile) => {
    if (!uploadedFile) return;
    setLoading(true);
    setResult(null);
    setRecognizedText("");

    try {
      // Шаг 1: OCR через Llama 4 Scout
      setLoadingStage("ocr");
      const extracted = await extractTextFromImage(uploadedFile);
      setRecognizedText(extracted);

      // Шаг 2: Анализ через Llama 3.3
      setLoadingStage("analysis");
      const analysis = await analyzeTextForFraud(extracted);
      setResult({ ...analysis, type: "file" });
    } catch (error) {
      console.error("OCR / Анализ қатесі:", error);
      setResult({ score: 0, hits: [], safe: true, type: "file", error: error.message });
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      const f = e.dataTransfer.files[0];
      setFile(f);
      analyzeFile(f);
    }
  };
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      setFile(f);
      analyzeFile(f);
    }
  };

  // Текст лоадера в зависимости от стадии
  const loadingText = loadingStage === "ocr"
      ? (ht?.ocrLoading || "Llama 4 Scout суретті оқуда…")
      : (ht?.scanning || "Llama 3.3 талдауда…");

  return (
      <div>
        {/* HERO */}
        <section style={{
          background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.blueMid} 100%)`,
          color: "white", padding: "5rem 1.25rem 4rem", textAlign: "center"
        }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "rgba(255,255,255,0.12)", borderRadius: 20,
              padding: "6px 16px", fontSize: 13, marginBottom: "1.5rem"
            }}>
              <Shield size={14} color="#6ee7b7" />
              {ht?.badge || "ЖИ негізіндегі алаяқтықты анықтау сканері"}
            </div>

            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, lineHeight: 1.2, marginBottom: "1rem" }}>
              {ht?.heroTitle || "Күдікті хабарламаны немесе чат скриншотын тексеріңіз."}
            </h1>
            <p style={{ fontSize: 17, opacity: 0.8, marginBottom: "2.5rem", lineHeight: 1.6 }}>
              {ht?.heroSub || "Біздің AI мәтінді немесе суреттегі чатты оқып, алаяқтық ықтималдығын пайызбен көрсетеді."}
            </p>

            {/* Бейдж моделей */}
            <div style={{
              display: "inline-flex", gap: 12, marginBottom: "1.5rem",
              background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "8px 16px"
            }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(255,255,255,0.9)" }}>
              <Eye size={13} color="#6ee7b7" /> Llama 4 Scout — OCR
            </span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>|</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(255,255,255,0.9)" }}>
              <Brain size={13} color="#93c5fd" /> Llama 3.3 70b — Анализ
            </span>
            </div>

            {/* КАРТОЧКА */}
            <div style={{
              background: "white", borderRadius: 16, padding: "1.25rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)"
            }}>
              {/* Табы */}
              <div style={{ display: "flex", gap: 10, marginBottom: "1rem" }}>
                {[
                  { key: "text", label: ht?.modeText || "Мәтінді тексеру" },
                  { key: "file", label: ht?.modeFile || "Скриншот / Чат жүктеу" },
                ].map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => { setMode(key); setResult(null); setRecognizedText(""); }}
                        style={{
                          flex: 1, padding: "0.6rem", borderRadius: 8, border: "none",
                          fontWeight: 600, cursor: "pointer",
                          background: mode === key ? COLORS.blueLight : "transparent",
                          color: mode === key ? COLORS.blue : COLORS.gray,
                          transition: "all 0.2s"
                        }}
                    >
                      {label}
                    </button>
                ))}
              </div>

              {/* Текстовый режим */}
              {mode === "text" && (
                  <>
                <textarea
                    value={text}
                    onChange={e => { setText(e.target.value); setResult(null); }}
                    placeholder={ht?.scanPhText || "Күдікті мәтінді немесе сілтемені осында қойыңыз..."}
                    style={{
                      width: "100%", minHeight: 130, resize: "vertical",
                      border: `1.5px solid ${COLORS.border}`, borderRadius: 10,
                      padding: "0.85rem 1rem", fontSize: 14, color: "#1f2937",
                      fontFamily: "inherit", outline: "none", boxSizing: "border-box", lineHeight: 1.6
                    }}
                />
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
                      <button
                          onClick={checkText}
                          disabled={loading || !text.trim()}
                          style={{
                            background: loading ? COLORS.gray : COLORS.green,
                            color: "white", border: "none", borderRadius: 10,
                            padding: "0.7rem 2rem", fontSize: 15, fontWeight: 600,
                            cursor: text.trim() && !loading ? "pointer" : "not-allowed",
                            display: "flex", alignItems: "center", gap: 8,
                            opacity: !text.trim() ? 0.6 : 1, transition: "all 0.2s"
                          }}
                      >
                        {loading
                            ? <>{loadingText}</>
                            : <><Search size={16} /> {ht?.scanBtn || "Тексеру"}</>
                        }
                      </button>
                    </div>
                  </>
              )}

              {/* Файловый режим */}
              {mode === "file" && (
                  <div
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      onClick={() => !loading && fileInputRef.current?.click()}
                      style={{
                        border: `2px dashed ${isDragging ? COLORS.blue : COLORS.border}`,
                        borderRadius: 12, padding: "2rem 1rem", textAlign: "center",
                        cursor: loading ? "default" : "pointer",
                        background: isDragging ? COLORS.blueLight : "transparent",
                        transition: "all 0.2s",
                      }}
                  >
                    <input
                        type="file" accept="image/*"
                        style={{ display: "none" }} ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    {loading ? (
                        <div style={{ color: COLORS.blue, fontWeight: 600 }}>
                          <div style={{ marginBottom: 8, fontSize: 24 }}>
                            {loadingStage === "ocr" ? "👁️" : "🧠"}
                          </div>
                          <div>{loadingText}</div>
                          <div style={{ fontSize: 12, color: COLORS.gray, marginTop: 4 }}>
                            {loadingStage === "ocr" ? "Llama 4 Scout Vision..." : "Llama 3.3 70b..."}
                          </div>
                        </div>
                    ) : file ? (
                        <div style={{ color: COLORS.green, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <FileImage size={20} /> {file.name} {ht?.fileLoaded || "жүктелді. Өзгерту үшін басыңыз."}
                        </div>
                    ) : (
                        <div>
                          <UploadCloud size={32} color={COLORS.gray} style={{ marginBottom: 10 }} />
                          <p style={{ color: COLORS.blue, fontWeight: 600, margin: "0 0 5px" }}>
                            {ht?.uploadPrompt1 || "Чат скриншотын осында тастаңыз"}
                          </p>
                          <p style={{ color: COLORS.gray, fontSize: 13, margin: 0 }}>
                            {ht?.uploadPrompt2 || "немесе файлды таңдау үшін басыңыз"}
                          </p>
                        </div>
                    )}
                  </div>
              )}

              {/* РЕЗУЛЬТАТ */}
              {result && (
                  <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

                    {/* Ошибка API */}
                    {result.error ? (
                        <div style={{
                          background: "#fff8e1", border: "1.5px solid #f59e0b",
                          borderRadius: 10, padding: "1rem", color: "#92400e", fontSize: 14
                        }}>
                          ⚠️ {ht?.apiError || "API қатесі. Кілтті тексеріңіз."}{" "}
                          <code style={{ fontSize: 12, display: "block", marginTop: 4, wordBreak: "break-all" }}>
                            {result.error}
                          </code>
                        </div>
                    ) : (
                        <>
                          {/* Основной результат */}
                          <div style={{
                            background: result.safe ? COLORS.greenLight : COLORS.redLight,
                            border: `1.5px solid ${result.safe ? "#059669" : "#dc2626"}`,
                            borderRadius: 10, padding: "1.25rem",
                            display: "flex", gap: "1rem", alignItems: "center"
                          }}>
                            <div style={{
                              width: 70, height: 70, borderRadius: "50%", background: "white",
                              border: `4px solid ${result.safe ? COLORS.green : COLORS.red}`,
                              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                            }}>
                        <span style={{ fontWeight: 800, fontSize: 20, color: result.safe ? COLORS.green : COLORS.red }}>
                          {result.score}%
                        </span>
                            </div>
                            <div style={{ textAlign: "left" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                {result.safe
                                    ? <CheckCircle size={18} color={COLORS.green} />
                                    : <XCircle size={18} color={COLORS.red} />
                                }
                                <span style={{ fontWeight: 700, color: result.safe ? "#065f46" : "#991b1b", fontSize: 16 }}>
                            {result.safe
                                ? (ht?.resultSafe || "Қауіпсіз болуы мүмкін")
                                : (ht?.resultUnsafe || "Алаяқтық қаупі өте жоғары!")}
                          </span>
                              </div>
                              <p style={{ fontSize: 13, color: result.safe ? "#065f46" : "#991b1b", margin: 0 }}>
                                {result.hits.length > 0
                                    ? <>{ht?.foundThreats || "Табылған қауіптер:"} <strong>{result.hits.join(", ")}</strong></>
                                    : (ht?.noThreats || "AI күдікті маркерлерді тапқан жоқ.")}
                              </p>
                              {/* Бейдж использованных моделей */}
                              <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {result.type === "file" && (
                                    <span style={{ fontSize: 11, background: "#ede9fe", color: "#6d28d9", borderRadius: 6, padding: "2px 8px" }}>
                              👁️ Llama 4 Scout OCR
                            </span>
                                )}
                                <span style={{ fontSize: 11, background: "#dbeafe", color: "#1d4ed8", borderRadius: 6, padding: "2px 8px" }}>
                            🧠 Llama 3.3 70b
                          </span>
                              </div>
                            </div>
                          </div>

                          {/* Экстренные действия при риске >= 75% */}
                          {result.score >= 75 && (
                              <div style={{
                                background: "#fff5f5", border: "1px solid #dc2626",
                                borderRadius: 12, padding: "1.25rem",
                                boxShadow: "0 4px 12px rgba(220, 38, 38, 0.1)"
                              }}>
                                <p style={{ fontSize: 14, fontWeight: 700, color: "#991b1b", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: 8 }}>
                                  <ShieldAlert size={18} /> {t?.home?.actionTitle || "Шұғыл іс-қимылдар / Экстренные действия:"}
                                </p>
                                <ul style={{ fontSize: 13, color: "#4b5563", paddingLeft: "1.2rem", marginBottom: "1rem", lineHeight: "1.8" }}>
                                  <li><b>{t?.home?.stepBank || "Банктік картаны бұғаттаңыз"}:</b> 1477</li>
                                  <li><b>{t?.home?.stepPolice || "Полицияға хабарлаңыз"}:</b> 102</li>
                                  <li><b>{t?.home?.stepEgov || "Арыз беріңіз"}:</b> e-Otinish</li>
                                </ul>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                  <a href="tel:102" style={{
                                    flex: 1, background: "#dc2626", color: "white", textDecoration: "none",
                                    padding: "0.7rem", borderRadius: 8, fontSize: 14, fontWeight: 700,
                                    textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                                  }}>
                                    📞 102 ({t?.home?.policeBtn || "Полиция"})
                                  </a>
                                  <a href="https://egov.kz/cms/ru/services/e_app" target="_blank" rel="noreferrer" style={{
                                    flex: 1, background: COLORS.blue, color: "white", textDecoration: "none",
                                    padding: "0.7rem", borderRadius: 8, fontSize: 14, fontWeight: 700,
                                    textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                                  }}>
                                    {t?.home?.egovBtn || "e-Otinish ашу"}
                                  </a>
                                </div>
                              </div>
                          )}
                        </>
                    )}

                    {/* Распознанный текст со скриншота */}
                    {mode === "file" && recognizedText && (
                        <div style={{
                          background: COLORS.grayLight, border: `1px solid ${COLORS.border}`,
                          borderRadius: 10, padding: "1rem", textAlign: "left"
                        }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.blue, margin: "0 0 0.5rem 0" }}>
                            👁️ {ht?.ocrResultTitle || "Llama 4 Scout оқыған мәтін:"}
                          </p>
                          <div style={{
                            fontSize: 13, color: COLORS.gray, whiteSpace: "pre-wrap",
                            maxHeight: "150px", overflowY: "auto", fontFamily: "monospace", paddingRight: "5px"
                          }}>
                            {recognizedText}
                          </div>
                        </div>
                    )}
                  </div>
              )}
            </div>
          </div>
        </section>

        {/* СТАТИСТИКА */}
        <section style={{ background: COLORS.green, padding: "1.5rem 1.25rem" }}>
          <div style={{
            maxWidth: 1100, margin: "0 auto",
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem", textAlign: "center"
          }}>
            {[
              ["12,400+", ht?.stat1 || "Құжатталған алаяқтық"],
              ["3.2M ₸",  ht?.stat2 || "Орташа шығын"],
              ["94%",     ht?.stat3 || "Анықтау дәлдігі"],
            ].map(([val, label]) => (
                <div key={label}>
                  <p style={{ color: "white", fontWeight: 700, fontSize: "clamp(1.4rem, 3vw, 2rem)", margin: 0 }}>{val}</p>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, margin: 0 }}>{label}</p>
                </div>
            ))}
          </div>
        </section>

        {/* КАК ЭТО РАБОТАЕТ */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 1.25rem" }}>
          <h2 style={{ textAlign: "center", fontSize: "1.6rem", fontWeight: 700, color: COLORS.blue, marginBottom: "0.5rem" }}>
            {ht?.hiwTitle || "Бұл қалай жұмыс істейді"}
          </h2>
          <p style={{ textAlign: "center", color: COLORS.gray, marginBottom: "2.5rem" }}>
            {ht?.hiwSub || "Күдікті хабарламаны тексерудің үш қадамы"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[
              {
                n: "01",
                icon: <MessageSquare size={28} color={COLORS.blue} />,
                title: ht?.step1Title || "Деректі енгізіңіз",
                desc: ht?.step1Desc || "Мәтінді көшіріңіз немесе чат скриншотын жүктеңіз.",
                badge: null
              },
              {
                n: "02",
                icon: <Eye size={28} color="#7c3aed" />,
                title: ht?.step2Title || "Llama 4 Scout OCR",
                desc: ht?.step2Desc || "Скриншоттағы мәтінді Llama 4 Scout vision моделі оқиды.",
                badge: "👁️ Vision"
              },
              {
                n: "03",
                icon: <Brain size={28} color={COLORS.green} />,
                title: ht?.step3Title || "Llama 3.3 талдайды",
                desc: ht?.step3Desc || "Llama 3.3 70b мәтінді терең талдап, алаяқтық пайызын береді.",
                badge: "🧠 70b"
              },
            ].map(s => (
                <div key={s.n} style={{
                  background: "white", border: `1px solid ${COLORS.border}`,
                  borderRadius: 16, padding: "1.75rem", position: "relative", overflow: "hidden"
                }}>
                  <div style={{
                    position: "absolute", top: 16, right: 16,
                    fontSize: 42, fontWeight: 800, color: COLORS.blueLight, lineHeight: 1
                  }}>{s.n}</div>
                  <div style={{ marginBottom: 14 }}>{s.icon}</div>
                  <h3 style={{ fontWeight: 700, fontSize: 16, color: COLORS.blue, marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ color: COLORS.gray, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                  {s.badge && (
                      <span style={{
                        display: "inline-block", marginTop: 10, fontSize: 11,
                        background: COLORS.blueLight, color: COLORS.blue,
                        borderRadius: 6, padding: "2px 8px", fontWeight: 600
                      }}>{s.badge}</span>
                  )}
                </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: COLORS.blueLight, padding: "3rem 1.25rem", textAlign: "center" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.4rem", color: COLORS.blue, marginBottom: "0.75rem" }}>
            {ht?.ctaTitle || "Алаяқтықты өзіңіз анықтап үйренгіңіз келе ме?"}
          </h2>
          <p style={{ color: COLORS.gray, marginBottom: "1.5rem" }}>
            {ht?.ctaSub || "Академиямызда тегін тесттерден өтіп, Қауіпсіздік көрсеткішіңізді көтеріңіз."}
          </p>
          <button
              onClick={() => setPage("academy")}
              style={{
                background: COLORS.blue, color: "white", border: "none",
                borderRadius: 10, padding: "0.75rem 2rem", fontSize: 15, fontWeight: 600,
                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8
              }}
          >
            {ht?.ctaBtn || "Оқуды бастау"} <ArrowRight size={16} />
          </button>
        </section>
      </div>
  );
}
