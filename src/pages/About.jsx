import React, { useState } from "react";
import { Shield, Send, CheckCircle } from "lucide-react";
import { COLORS } from "../data";

export default function AboutPage() {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);

  return (
    <div>
      <section style={{ background: COLORS.blue, padding: "4rem 1.25rem 3rem", textAlign: "center", color: "white" }}>
        <Shield size={48} color="#6ee7b7" style={{ marginBottom: "1rem" }} />
        <h1 style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: "1rem" }}>Қазақстанды киберқылмысқа қарсы күшейту</h1>
        <p style={{ opacity: 0.8, fontSize: 16, maxWidth: 520, margin: "0 auto" }}>SenimWiki — халықты оқытуға және қазақстандықтарды қаржылық алаяқтықтан қорғауға арналған тегін платформа.</p>
      </section>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 1.25rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "1.3rem", color: COLORS.blue, marginBottom: "1.25rem" }}>Бізбен байланыс</h2>
            {!sent ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Атыңыз" style={{ padding: "0.7rem 1rem", border: `1.5px solid ${COLORS.border}`, borderRadius: 10, fontSize: 14 }} />
                <input value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="Email мекенжайы" style={{ padding: "0.7rem 1rem", border: `1.5px solid ${COLORS.border}`, borderRadius: 10, fontSize: 14 }} />
                <textarea value={form.msg} onChange={e => setForm(p => ({...p, msg: e.target.value}))} placeholder="Хабарламаңыз..." rows={4} style={{ padding: "0.7rem 1rem", border: `1.5px solid ${COLORS.border}`, borderRadius: 10, fontSize: 14 }} />
                <button onClick={() => setSent(true)} style={{ background: COLORS.blue, color: "white", border: "none", borderRadius: 10, padding: "0.75rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>Жіберу</button>
              </div>
            ) : (
              <div style={{ background: COLORS.greenLight, border: `1.5px solid ${COLORS.green}`, borderRadius: 12, padding: "1.5rem", textAlign: "center" }}>
                <CheckCircle size={32} color={COLORS.green} style={{ marginBottom: 10 }} />
                <p style={{ fontWeight: 600, color: "#065f46", margin: 0 }}>Хабарлама жіберілді! 24 сағат ішінде жауап береміз.</p>
              </div>
            )}
          </div>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "1.3rem", color: COLORS.blue, marginBottom: "1.25rem" }}>Алаяқтық туралы хабарлау</h2>
            <p style={{ color: COLORS.gray, fontSize: 14, lineHeight: 1.7, marginBottom: "1.25rem" }}>Жаңа алаяқтық түрін немесе тізімде жоқ күдікті ұйымды таптыңыз ба? Telegram ботымыз арқылы тікелей хабарлаңыз.</p>
            <a href="https://t.me/senimwiki_bot" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, background: "#0088cc", color: "white", borderRadius: 12, padding: "1rem 1.5rem", textDecoration: "none", fontWeight: 600, fontSize: 15, marginBottom: "1rem" }}>
              <Send size={18} /> Telegram бот арқылы жіберу
            </a>
            <div style={{ background: COLORS.amberLight, border: `1px solid #fcd34d`, borderRadius: 12, padding: "1rem 1.25rem" }}>
              <p style={{ color: "#92400e", fontSize: 13, margin: 0, lineHeight: 1.6 }}><strong>Шұғыл жағдай?</strong> Егер сіз алаяқтардың құрбаны болсаңыз, Ұлттық қаржылық қауіпсіздік желісіне хабарласыңыз: <strong>1400</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
