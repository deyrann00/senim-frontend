import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, BookOpen, GraduationCap, Flag, ShieldAlert,
  Plus, Trash2, Globe, ImageIcon, CheckCircle, XCircle,
  ChevronRight, ArrowLeft, Save, Loader, FileText
} from "lucide-react";

const API = "https://senim-backend-production.up.railway.app";

const T = {
  primary:   "#0f3460",
  primaryLt: "#e8f0fb",
  green:     "#059669",
  greenLt:   "#d1fae5",
  red:       "#dc2626",
  redLt:     "#fee2e2",
  amber:     "#d97706",
  amberLt:   "#fef3c7",
  gray:      "#6b7280",
  grayLt:    "#f3f4f6",
  border:    "#e5e7eb",
  bg:        "#f9fafb",
  white:     "#ffffff",
  text:      "#111827",
  sub:       "#6b7280",
};

// ─── Atoms ─────────────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, ...style }}>
    {children}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", disabled, size = "md", style = {} }) => {
  const base = {
    primary: { background: T.primary, color: "#fff", border: "none" },
    ghost:   { background: "transparent", color: T.gray, border: `1px solid ${T.border}` },
    danger:  { background: "transparent", color: T.red, border: `1.5px solid ${T.red}` },
    success: { background: T.green, color: "#fff", border: "none" },
    outline: { background: "transparent", color: T.primary, border: `1.5px solid ${T.primary}` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...base[variant],
      padding: size === "sm" ? "5px 13px" : "8px 18px",
      fontSize: size === "sm" ? 13 : 14,
      borderRadius: 8, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1, display: "inline-flex", alignItems: "center",
      gap: 6, fontFamily: "inherit", transition: "opacity 0.15s", ...style,
    }}>
      {children}
    </button>
  );
};

const Input = ({ value, onChange, placeholder, style = {} }) => (
  <input value={value} onChange={onChange} placeholder={placeholder} style={{
    width: "100%", padding: "8px 11px", border: `1px solid ${T.border}`, borderRadius: 8,
    fontSize: 14, color: T.text, outline: "none", fontFamily: "inherit",
    background: T.white, boxSizing: "border-box", ...style,
  }} />
);

const Textarea = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{
    width: "100%", padding: "8px 11px", border: `1px solid ${T.border}`, borderRadius: 8,
    fontSize: 14, color: T.text, outline: "none", fontFamily: "inherit",
    resize: "vertical", background: T.white, boxSizing: "border-box",
  }} />
);

const Select = ({ value, onChange, children }) => (
  <select value={value} onChange={onChange} style={{
    width: "100%", padding: "8px 11px", border: `1px solid ${T.border}`, borderRadius: 8,
    fontSize: 14, color: T.text, outline: "none", fontFamily: "inherit",
    background: T.white, boxSizing: "border-box",
  }}>
    {children}
  </select>
);

const Field = ({ label, children, style = {} }) => (
  <div style={{ marginBottom: 14, ...style }}>
    <p style={{ fontSize: 12, fontWeight: 600, color: T.primary, margin: "0 0 5px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
      {label}
    </p>
    {children}
  </div>
);

const LangTabs = ({ lang, setLang }) => (
  <div style={{ display: "inline-flex", background: T.grayLt, borderRadius: 8, padding: 3, marginBottom: 18, gap: 2 }}>
    {["kz", "ru"].map(l => (
      <button key={l} onClick={() => setLang(l)} style={{
        padding: "5px 16px", borderRadius: 6, border: "none", cursor: "pointer",
        fontWeight: 600, fontSize: 13, fontFamily: "inherit",
        background: lang === l ? T.white : "transparent",
        color: lang === l ? T.primary : T.sub,
        boxShadow: lang === l ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
        transition: "all 0.15s",
      }}>
        <Globe size={11} style={{ marginRight: 5, verticalAlign: "middle" }} />
        {l === "kz" ? "Қазақша" : "Русский"}
      </button>
    ))}
  </div>
);

const Toast = ({ msg, type }) => {
  if (!msg) return null;
  const [bg, fg] = type === "error" ? [T.redLt, T.red] : [T.greenLt, T.green];
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, background: bg, border: `1px solid ${fg}`,
      color: fg, padding: "11px 18px", borderRadius: 10, fontSize: 14, fontWeight: 600,
      zIndex: 9999, display: "flex", alignItems: "center", gap: 8,
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    }}>
      {type === "error" ? <XCircle size={15} /> : <CheckCircle size={15} />}
      {msg}
    </div>
  );
};

const Spin = () => (
  <>
    <Loader size={20} color={T.sub} style={{ animation: "admSpin 1s linear infinite" }} />
    <style>{`@keyframes admSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
  </>
);

const SectionHeader = ({ title, sub, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
    <div>
      <h2 style={{ fontWeight: 700, fontSize: 19, color: T.primary, margin: 0 }}>{title}</h2>
      {sub && <p style={{ fontSize: 13, color: T.sub, margin: "4px 0 0" }}>{sub}</p>}
    </div>
    {action}
  </div>
);

const FillPills = ({ fields }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
    {fields.map(([label, val]) => (
      <span key={label} style={{
        fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20,
        background: val.trim() ? T.greenLt : T.grayLt,
        color: val.trim() ? T.green : T.sub,
      }}>
        {val.trim() ? "✓" : "○"} {label}
      </span>
    ))}
  </div>
);

// ─── WIKI MODULE ───────────────────────────────────────────────────────────────
function WikiModule() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [lang, setLang] = useState("kz");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const empty = { title_kz: "", title_ru: "", content_kz: "", content_ru: "", scamCategory: "", imageUrl: "" };
  const [form, setForm] = useState(empty);
  // Добавляем состояние для хранения ID редактируемой статьи
  const [editId, setEditId] = useState(null);

  const notify = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/articles`)
      .then(r => r.json())
      .then(d => { setArticles(d); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(load, []);

  // Функция для входа в режим редактирования
  const handleEdit = (article) => {
    setEditId(article.id);
    setForm({
      title_kz: article.title_kz || "",
      title_ru: article.title_ru || "",
      content_kz: article.content_kz || "",
      content_ru: article.content_ru || "",
      scamCategory: article.scamCategory || "",
      imageUrl: article.imageUrl || ""
    });
    setView("form");
  };

  // Функция удаления
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      const r = await fetch(`${API}/api/articles/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error();
      notify("Article deleted");
      load();
    } catch { notify("Failed to delete article", "error"); }
  };

  const submit = async () => {
    if (!form.title_kz.trim() && !form.title_ru.trim()) return;
    setSaving(true);
    
    // Определяем метод и URL в зависимости от того, редактируем мы или создаем
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API}/api/articles/${editId}` : `${API}/api/articles`;

    try {
      const r = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title_kz || form.title_ru,
          content: form.content_kz || form.content_ru,
          title_kz: form.title_kz, title_ru: form.title_ru,
          content_kz: form.content_kz, content_ru: form.content_ru,
          scamCategory: form.scamCategory, imageUrl: form.imageUrl,
        }),
      });
      if (!r.ok) throw new Error();
      
      notify(editId ? "Article updated!" : "Article saved!");
      setForm(empty); 
      setEditId(null);
      setView("list"); 
      load();
    } catch { notify("Failed to save article", "error"); }
    finally { setSaving(false); }
  };

  // Сброс формы при отмене
  const cancelEdit = () => {
    setForm(empty);
    setEditId(null);
    setView("list");
  };

  return (
    <div>
      <Toast {...(toast || { msg: null })} />
      <SectionHeader
        title="Wiki Articles"
        sub={`${articles.length} articles in the knowledge base`}
        action={
          view === "list"
            ? <Btn onClick={() => { setEditId(null); setForm(empty); setView("form"); }}><Plus size={14} />New Article</Btn>
            : <Btn variant="ghost" onClick={cancelEdit}><ArrowLeft size={14} />Back</Btn>
        }
      />

      {view === "form" && (
        <Card style={{ padding: 24, marginBottom: 20 }}>
          <p style={{ fontWeight: 700, fontSize: 15, color: T.primary, margin: "0 0 18px" }}>
            {editId ? "Edit Article" : "Add New Article"}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
            <Field label="Scam Category">
              <Input value={form.scamCategory} onChange={e => set("scamCategory", e.target.value)} placeholder="e.g. Phishing, Investment Fraud" />
            </Field>
            <Field label="Image URL (optional)">
              <div style={{ position: "relative" }}>
                <ImageIcon size={13} color={T.sub} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <Input value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} placeholder="https://…" style={{ paddingLeft: 30 }} />
              </div>
            </Field>
          </div>

          <LangTabs lang={lang} setLang={setLang} />

          {lang === "kz" ? (
            <>
              <Field label="Title (Қазақша)">
                <Input value={form.title_kz} onChange={e => set("title_kz", e.target.value)} placeholder="Мақала атауы..." />
              </Field>
              <Field label="Content (Қазақша)">
                <Textarea value={form.content_kz} onChange={e => set("content_kz", e.target.value)} placeholder="Мақала мазмұны..." rows={5} />
              </Field>
            </>
          ) : (
            <>
              <Field label="Title (Русский)">
                <Input value={form.title_ru} onChange={e => set("title_ru", e.target.value)} placeholder="Заголовок статьи..." />
              </Field>
              <Field label="Content (Русский)">
                <Textarea value={form.content_ru} onChange={e => set("content_ru", e.target.value)} placeholder="Содержание статьи..." rows={5} />
              </Field>
            </>
          )}

          <FillPills fields={[["KZ title", form.title_kz], ["RU title", form.title_ru], ["KZ content", form.content_kz], ["RU content", form.content_ru]]} />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Btn variant="ghost" onClick={cancelEdit}>Cancel</Btn>
            <Btn onClick={submit} disabled={saving || (!form.title_kz.trim() && !form.title_ru.trim())}>
              {saving ? <><Spin />Saving…</> : <><Save size={14} />{editId ? "Update Article" : "Save Article"}</>}
            </Btn>
          </div>
        </Card>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: T.sub, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Spin /><span>Loading articles…</span>
        </div>
      ) : (
        <Card>
          {articles.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: T.sub }}>
              <FileText size={30} style={{ opacity: 0.35, marginBottom: 8 }} /><br />No articles yet.
            </div>
          ) : articles.map((a, i) => (
            <div key={a.id} style={{ padding: "13px 18px", borderBottom: i < articles.length - 1 ? `1px solid ${T.border}` : "none", display: "flex", alignItems: "center", gap: 12 }}>
              {a.imageUrl ? (
                <img src={a.imageUrl} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />
              ) : (
                <div style={{ width: 36, height: 36, borderRadius: 8, background: T.primaryLt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileText size={15} color={T.primary} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {a.title_kz || a.title || "Untitled"}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: T.sub }}>{a.scamCategory}</p>
              </div>
              
              {/* Добавляем кнопки управления */}
              <div style={{ display: "flex", gap: 8 }}>
                <Btn size="sm" variant="ghost" onClick={() => handleEdit(a)}>Edit</Btn>
                <Btn size="sm" variant="danger" onClick={() => handleDelete(a.id)}><Trash2 size={14} /></Btn>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
// ─── QUIZ MODULE ───────────────────────────────────────────────────────────────
function QuizModule() {
  const [toast, setToast] = useState(null);
  const [lang, setLang] = useState("kz");
  const notify = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const blankQ = () => ({ q: "", qRu: "", options: ["", "", "", ""], optionsRu: ["", "", "", ""], answer: 0 });
  const blank = () => ({ title: "", titleRu: "", difficulty: "Бастапқы", difficultyRu: "Начальный", questions: [blankQ()] });
  const [form, setForm] = useState(blank());
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("senimwiki_custom_quizzes") || "[]"); } catch { return []; }
  });

  const setTop = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setQF = (qi, k, v) => setForm(p => { const qs = [...p.questions]; qs[qi] = { ...qs[qi], [k]: v }; return { ...p, questions: qs }; });
  const setOpt = (qi, oi, v, ru) => setForm(p => {
    const qs = [...p.questions]; const key = ru ? "optionsRu" : "options";
    const opts = [...qs[qi][key]]; opts[oi] = v; qs[qi] = { ...qs[qi], [key]: opts }; return { ...p, questions: qs };
  });

  const save = () => {
    try {
      const next = [...saved, { id: Date.now(), ...form }];
      localStorage.setItem("senimwiki_custom_quizzes", JSON.stringify(next));
      setSaved(next); notify("Quiz saved!"); setForm(blank());
    } catch { notify("Failed to save", "error"); }
  };

  const diffKZ = ["Бастапқы", "Орташа", "Жоғары"];
  const diffRU = ["Начальный", "Средний", "Высокий"];

  return (
    <div>
      <Toast {...(toast || { msg: null })} />
      <SectionHeader title="Quiz Builder" sub={`${saved.length} saved · compatible with Academy module`} />

      <Card style={{ padding: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, paddingBottom: 20, marginBottom: 20, borderBottom: `1px solid ${T.border}` }}>
          <Field label="Title (KZ)"><Input value={form.title} onChange={e => setTop("title", e.target.value)} placeholder="Тест атауы..." /></Field>
          <Field label="Title (RU)"><Input value={form.titleRu} onChange={e => setTop("titleRu", e.target.value)} placeholder="Название теста..." /></Field>
          <Field label="Difficulty (KZ)">
            <Select value={form.difficulty} onChange={e => setTop("difficulty", e.target.value)}>
              {diffKZ.map(d => <option key={d}>{d}</option>)}
            </Select>
          </Field>
          <Field label="Difficulty (RU)">
            <Select value={form.difficultyRu} onChange={e => setTop("difficultyRu", e.target.value)}>
              {diffRU.map(d => <option key={d}>{d}</option>)}
            </Select>
          </Field>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <p style={{ fontWeight: 700, fontSize: 14, color: T.primary, margin: 0 }}>Questions ({form.questions.length})</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LangTabs lang={lang} setLang={setLang} />
            <Btn size="sm" onClick={() => setForm(p => ({ ...p, questions: [...p.questions, blankQ()] }))}>
              <Plus size={13} />Add
            </Btn>
          </div>
        </div>

        {form.questions.map((q, qi) => (
          <div key={qi} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.primary, background: T.primaryLt, padding: "3px 10px", borderRadius: 20 }}>Q{qi + 1}</span>
              {form.questions.length > 1 && (
                <button onClick={() => setForm(p => ({ ...p, questions: p.questions.filter((_, i) => i !== qi) }))}
                  style={{ background: "none", border: "none", cursor: "pointer", color: T.red, padding: 4 }}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            {lang === "kz" ? (
              <>
                <Field label="Question (Қазақша)">
                  <Input value={q.q} onChange={e => setQF(qi, "q", e.target.value)} placeholder="Сұрақ мәтіні..." />
                </Field>
                <p style={{ fontSize: 12, fontWeight: 600, color: T.primary, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Options KZ — circle = correct answer
                </p>
                {q.options.map((opt, oi) => (
                  <div key={oi} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <button onClick={() => setQF(qi, "answer", oi)} style={{
                      width: 18, height: 18, borderRadius: "50%", flexShrink: 0, padding: 0, cursor: "pointer",
                      border: `2px solid ${q.answer === oi ? T.green : T.border}`,
                      background: q.answer === oi ? T.green : T.white,
                    }} />
                    <Input value={opt} onChange={e => setOpt(qi, oi, e.target.value, false)} placeholder={`Option ${oi + 1}`} />
                  </div>
                ))}
              </>
            ) : (
              <>
                <Field label="Question (Русский)">
                  <Input value={q.qRu} onChange={e => setQF(qi, "qRu", e.target.value)} placeholder="Текст вопроса..." />
                </Field>
                <p style={{ fontSize: 12, fontWeight: 600, color: T.primary, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Options RU — correct answer synced with KZ
                </p>
                {q.optionsRu.map((opt, oi) => (
                  <div key={oi} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                      border: `2px solid ${q.answer === oi ? T.green : T.border}`,
                      background: q.answer === oi ? T.green : T.white,
                    }} />
                    <Input value={opt} onChange={e => setOpt(qi, oi, e.target.value, true)} placeholder={`Вариант ${oi + 1}`} />
                  </div>
                ))}
              </>
            )}
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <Btn onClick={save} disabled={!form.title.trim() && !form.titleRu.trim()}>
            <Save size={14} />Save Quiz
          </Btn>
        </div>
      </Card>

      {saved.length > 0 && (
        <Card style={{ marginTop: 20 }}>
          <div style={{ padding: "12px 18px", borderBottom: `1px solid ${T.border}` }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: T.primary, margin: 0 }}>Saved Quizzes</p>
          </div>
          {saved.map((q, i) => (
            <div key={q.id} style={{ padding: "11px 18px", borderBottom: i < saved.length - 1 ? `1px solid ${T.border}` : "none", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: T.text }}>{q.title || q.titleRu}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: T.sub }}>{q.difficulty} · {q.questions?.length || 0} questions</p>
              </div>
              <button onClick={() => {
                const next = saved.filter((_, idx) => idx !== i);
                setSaved(next); localStorage.setItem("senimwiki_custom_quizzes", JSON.stringify(next));
              }} style={{ background: "none", border: "none", cursor: "pointer", color: T.sub, padding: 4 }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ─── REPORTS MODULE ────────────────────────────────────────────────────────────
function ReportsModule() {
  const KEY = "senimwiki_user_reports";
  const seed = [
    { id: 1, scheme: "Жалған Kaspi SMS — сілтемеге өту сұранысы", submittedAt: "2025-06-15", status: "pending" },
    { id: 2, scheme: "Instagram арқылы крипто инвестиция ұсынысы", submittedAt: "2025-06-18", status: "pending" },
    { id: 3, scheme: "WhatsApp жалған жұмыс берушілер", submittedAt: "2025-06-20", status: "approved" },
    { id: 4, scheme: "Фейк сайт kaspi-pay.kz — фишинг", submittedAt: "2025-06-22", status: "pending" },
    { id: 5, scheme: "Вишинг — банк қызметкері атынан қоңырау", submittedAt: "2025-06-23", status: "dismissed" },
  ];
  const [reports, setReports] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "null") || seed; } catch { return seed; }
  });
  const update = (id, status) => {
    const next = reports.map(r => r.id === id ? { ...r, status } : r);
    setReports(next); localStorage.setItem(KEY, JSON.stringify(next));
  };
  const counts = {
    pending: reports.filter(r => r.status === "pending").length,
    approved: reports.filter(r => r.status === "approved").length,
    dismissed: reports.filter(r => r.status === "dismissed").length,
  };
  const badge = s => ({ pending: { bg: T.amberLt, color: T.amber, label: "Pending" }, approved: { bg: T.greenLt, color: T.green, label: "Approved" }, dismissed: { bg: T.grayLt, color: T.sub, label: "Dismissed" } }[s] || { bg: T.grayLt, color: T.sub, label: s });

  return (
    <div>
      <SectionHeader title="User Reports" sub="Submitted via the 'Not in base' form" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 22 }}>
        {[["Pending", counts.pending, T.amber], ["Approved", counts.approved, T.green], ["Dismissed", counts.dismissed, T.sub]].map(([label, val, color]) => (
          <Card key={label} style={{ padding: "14px 18px" }}>
            <p style={{ margin: "0 0 3px", fontSize: 12, color: T.sub, fontWeight: 500 }}>{label}</p>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color }}>{val}</p>
          </Card>
        ))}
      </div>
      <Card>
        {reports.map((r, i) => {
          const b = badge(r.status);
          return (
            <div key={r.id} style={{ padding: "14px 18px", borderBottom: i < reports.length - 1 ? `1px solid ${T.border}` : "none", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: T.amberLt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Flag size={15} color={T.amber} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: T.text }}>{r.scheme}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: T.sub }}>{r.submittedAt}</p>
              </div>
              <span style={{ background: b.bg, color: b.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, marginRight: 6, flexShrink: 0 }}>{b.label}</span>
              {r.status === "pending" && (
                <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                  <Btn size="sm" variant="success" onClick={() => update(r.id, "approved")}><CheckCircle size={12} />Approve</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => update(r.id, "dismissed")}><XCircle size={12} />Dismiss</Btn>
                </div>
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function BlacklistModule() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [view, setView] = useState("list");
  const [lang, setLang] = useState("kz");

  const empty = { name_kz: "", name_ru: "", description_kz: "", description_ru: "", reason_kz: "", reason_ru: "", status: "Suspicious" };
  const [form, setForm] = useState(empty);
  // Добавляем состояние для ID редактируемой записи
  const [editId, setEditId] = useState(null);

  const notify = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/funds`)
      .then(r => r.json())
      .then(d => { setFunds(d); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(load, []);

  // Функция для входа в режим редактирования
  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      name_kz: item.name_kz || "",
      name_ru: item.name_ru || "",
      description_kz: item.description_kz || "",
      description_ru: item.description_ru || "",
      reason_kz: item.reason_kz || "",
      reason_ru: item.reason_ru || "",
      status: item.status || "Suspicious"
    });
    setView("form");
  };

  // Функция удаления
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entity?")) return;
    try {
      const r = await fetch(`${API}/api/funds/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error();
      notify("Entity removed from blacklist");
      load();
    } catch { notify("Failed to delete entity", "error"); }
  };

  const submit = async () => {
    if (!form.name_kz.trim() && !form.name_ru.trim()) return;
    setSaving(true);

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API}/api/funds/${editId}` : `${API}/api/funds`;

    try {
      const r = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name_kz || form.name_ru,
          name_kz: form.name_kz, name_ru: form.name_ru,
          description: form.description_kz || form.description_ru,
          description_kz: form.description_kz, description_ru: form.description_ru,
          reason: form.reason_kz || form.reason_ru,
          reason_kz: form.reason_kz, reason_ru: form.reason_ru,
          status: form.status,
        }),
      });
      if (!r.ok) throw new Error();
      notify(editId ? "Entity updated!" : "Entity added!");
      setForm(empty);
      setEditId(null);
      setView("list");
      load();
    } catch { notify("Failed to save entity", "error"); }
    finally { setSaving(false); }
  };

  const cancelEdit = () => {
    setForm(empty);
    setEditId(null);
    setView("list");
  };

  const statusColor = s => ({ "Confirmed Fraud": T.red, "Suspicious": T.amber, "Under Review": T.gray }[s] || T.gray);

  return (
    <div>
      <Toast {...(toast || { msg: null })} />
      <SectionHeader
        title="Blacklist"
        sub={`${funds.length} entities on record`}
        action={
          view === "list"
            ? <Btn onClick={() => { setEditId(null); setForm(empty); setView("form"); }}><Plus size={14} />Add Entity</Btn>
            : <Btn variant="ghost" onClick={cancelEdit}><ArrowLeft size={14} />Back</Btn>
        }
      />

      {view === "form" && (
        <Card style={{ padding: 24, marginBottom: 20 }}>
          <p style={{ fontWeight: 700, fontSize: 15, color: T.primary, margin: "0 0 18px" }}>
            {editId ? "Edit Entity" : "Add to Blacklist"}
          </p>
          <Field label="Status" style={{ maxWidth: 260, marginBottom: 18 }}>
            <Select value={form.status} onChange={e => set("status", e.target.value)}>
              <option>Confirmed Fraud</option>
              <option>Suspicious</option>
              <option>Under Review</option>
            </Select>
          </Field>

          <LangTabs lang={lang} setLang={setLang} />

          {lang === "kz" ? (
            <>
              <Field label="Name (Қазақша)"><Input value={form.name_kz} onChange={e => set("name_kz", e.target.value)} placeholder="Ұйым немесе тұлға атауы..." /></Field>
              <Field label="Description (Қазақша)"><Textarea value={form.description_kz} onChange={e => set("description_kz", e.target.value)} placeholder="Қысқаша сипаттама..." rows={2} /></Field>
              <Field label="Reason (Қазақша)"><Textarea value={form.reason_kz} onChange={e => set("reason_kz", e.target.value)} placeholder="Тізімге кіруінің себебі..." rows={2} /></Field>
            </>
          ) : (
            <>
              <Field label="Name (Русский)"><Input value={form.name_ru} onChange={e => set("name_ru", e.target.value)} placeholder="Название организации..." /></Field>
              <Field label="Description (Русский)"><Textarea value={form.description_ru} onChange={e => set("description_ru", e.target.value)} placeholder="Краткое описание..." rows={2} /></Field>
              <Field label="Reason (Русский)"><Textarea value={form.reason_ru} onChange={e => set("reason_ru", e.target.value)} placeholder="Причина внесения в список..." rows={2} /></Field>
            </>
          )}

          <FillPills fields={[["KZ name", form.name_kz], ["RU name", form.name_ru], ["KZ desc", form.description_kz], ["RU desc", form.description_ru]]} />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Btn variant="ghost" onClick={cancelEdit}>Cancel</Btn>
            <Btn variant={editId ? "primary" : "danger"} onClick={submit} disabled={saving || (!form.name_kz.trim() && !form.name_ru.trim())}>
              {saving ? <><Spin />Saving…</> : <><ShieldAlert size={14} />{editId ? "Update Entity" : "Add to Blacklist"}</>}
            </Btn>
          </div>
        </Card>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: T.sub, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Spin /><span>Loading…</span>
        </div>
      ) : (
        <Card>
          {funds.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: T.sub }}>
              <ShieldAlert size={30} style={{ opacity: 0.35, marginBottom: 8 }} /><br />Blacklist is empty.
            </div>
          ) : funds.map((f, i) => (
            <div key={f.id} style={{ padding: "13px 18px", borderBottom: i < funds.length - 1 ? `1px solid ${T.border}` : "none", display: "flex", alignItems: "flex-start", gap: 13 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: `${statusColor(f.status)}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <ShieldAlert size={15} color={statusColor(f.status)} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 2 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: T.text }}>{f.name_kz || f.name_ru || f.name}</p>
                  <span style={{ background: `${statusColor(f.status)}18`, color: statusColor(f.status), fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20 }}>
                    {f.status}
                  </span>
                </div>
                {(f.description_kz || f.description) && <p style={{ margin: "2px 0 0", fontSize: 13, color: T.sub }}>{f.description_kz || f.description}</p>}
                {(f.reason_kz || f.reason) && <p style={{ margin: "2px 0 0", fontSize: 12, color: T.gray, fontStyle: "italic" }}>Reason: {f.reason_kz || f.reason}</p>}
              </div>

              {/* Кнопки управления */}
              <div style={{ display: "flex", gap: 8, alignSelf: "center" }}>
                <Btn size="sm" variant="ghost" onClick={() => handleEdit(f)}>Edit</Btn>
                <Btn size="sm" variant="danger" onClick={() => handleDelete(f.id)}><Trash2 size={14} /></Btn>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ─── SHELL ─────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "wiki",      label: "Wiki",      icon: BookOpen      },
  { id: "quizzes",   label: "Quizzes",   icon: GraduationCap },
  { id: "reports",   label: "Reports",   icon: Flag          },
  { id: "blacklist", label: "Blacklist", icon: ShieldAlert   },
];

export default function AdminPanel() {
  const [active, setActive] = useState("wiki");
  const modules = { wiki: <WikiModule />, quizzes: <QuizModule />, reports: <ReportsModule />, blacklist: <BlacklistModule /> };
  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)", background: T.bg, fontFamily: "inherit" }}>
      <aside style={{ width: 220, background: T.white, borderRight: `1px solid ${T.border}`, padding: "22px 0", flexShrink: 0 }}>
        <div style={{ padding: "0 14px 18px", borderBottom: `1px solid ${T.border}`, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 32, height: 32, background: T.primary, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LayoutDashboard size={16} color="white" />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: T.primary }}>Admin Panel</p>
              <p style={{ margin: 0, fontSize: 11, color: T.sub }}>SenimWiki</p>
            </div>
          </div>
        </div>
        <nav style={{ padding: "6px 10px" }}>
          {NAV.map(({ id, label, icon: Icon }) => {
            const on = active === id;
            return (
              <button key={id} onClick={() => setActive(id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 9,
                padding: "8px 11px", borderRadius: 8, border: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: 13, fontWeight: on ? 700 : 500,
                background: on ? T.primaryLt : "transparent",
                color: on ? T.primary : T.sub, marginBottom: 2,
                transition: "all 0.13s", textAlign: "left",
              }}>
                <Icon size={15} />{label}
                {on && <ChevronRight size={12} style={{ marginLeft: "auto" }} />}
              </button>
            );
          })}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: "30px 34px", overflowY: "auto" }}>
        {modules[active]}
      </main>
    </div>
  );
}
