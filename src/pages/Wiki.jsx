import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { C } from '../config/constants';
import { Modal } from '../components/UI';

export default function WikiPage({ t, setPage, setSelectedArticleId }) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [scheme, setScheme] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Backend data states
  const [wikiData, setWikiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const wt = t.wiki;

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://senim-backend-production.up.railway.app';

    fetch(`${baseUrl}/api/articles`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch Wiki articles');
          }
          return response.json();
        })
        .then(data => {
          // Format backend data to match the frontend styling
          const formattedData = data.map(article => {
            const categoryLow = (article.scamCategory || '').toLowerCase();
            let assignedColor = 'blue';
            let assignedIcon = '🛡️';

            // Assign colors and icons based on category text
            if (categoryLow.includes('finance') || categoryLow.includes('investment')) {
              assignedColor = 'amber';
              assignedIcon = '💰';
            } else if (categoryLow.includes('social engineering') || categoryLow.includes('phone')) {
              assignedColor = 'red';
              assignedIcon = '📞';
            } else if (categoryLow.includes('e-commerce') || categoryLow.includes('shop')) {
              assignedColor = 'green';
              assignedIcon = '🛒';
            } else if (categoryLow.includes('phishing')) {
              assignedColor = 'red';
              assignedIcon = '🎣';
            }

            return {
              id: article.id,
              title: article.title,
              category: article.scamCategory,
              desc: article.content,
              tags: article.scamCategory ? [article.scamCategory] : [],
              color: assignedColor,
              icon: assignedIcon
            };
          });
          setWikiData(formattedData);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching wiki data:', err);
          setError(err.message);
          setLoading(false);
        });
  }, []);

  const filtered = useMemo(() =>
      wikiData.filter(c => {
        const q = search.toLowerCase();
        return !q || c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.tags.some(tag => tag.toLowerCase().includes(q));
      }), [search, wikiData]);

  const colorMap = {
    blue: { bg: C.blueLight, icon: C.blue, text: C.blue },
    red: { bg: C.redLight, icon: C.red, text: C.red },
    amber: { bg: C.amberLight, icon: C.amber, text: C.amber },
    green: { bg: C.greenLight, icon: C.green, text: C.green },
  };

  return (
      <div>
        <section style={{ background: C.blue, padding: "3rem 1.25rem 2.5rem", textAlign: "center", color: "white" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>{wt.title}</h1>
          <p style={{ opacity: 0.8, marginBottom: "1.75rem" }}>{wt.sub}</p>
          <div style={{ maxWidth: 520, margin: "0 auto", position: "relative" }}>
            <Search size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.gray }}/>
            <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={wt.searchPh}
                style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.75rem", borderRadius: 10, border: "none", fontSize: 14, boxSizing: "border-box", outline: "none" }}
            />
          </div>
        </section>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.25rem" }}>
          <p style={{ color: C.gray, fontSize: 14, marginBottom: "1.5rem" }}>{filtered.length} {wt.found}</p>

          {loading && <p style={{ textAlign: "center", color: C.gray, padding: "2rem" }}>Загрузка...</p>}
          {error && <p style={{ textAlign: "center", color: C.red, padding: "2rem" }}>Ошибка: {error}</p>}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "1.25rem" }}>
            {!loading && !error && filtered.map(c => {
              const cm = colorMap[c.color] || colorMap.blue;
              return (
                  <div key={c.id} style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 14, padding: "1.5rem", display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 12, background: cm.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{c.icon}</div>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: 16, color: C.blue, marginBottom: 6 }}>{c.title}</h3>
                      <p style={{ color: C.gray, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {c.tags.map(tag => <span key={tag} style={{ background: cm.bg, color: cm.text, fontSize: 11, padding: "3px 9px", borderRadius: 20, fontWeight: 500 }}>{tag}</span>)}
                    </div>
                    <button
                        onClick={() => {
                          setSelectedArticleId(c.id);
                          setPage("article");
                        }}
                        style={{ marginTop: "auto", background: "none", border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "0.55rem 1rem", fontSize: 13, fontWeight: 500, color: C.blue, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                    >
                      {wt.more} <ChevronRight size={14}/>
                    </button>
                  </div>
              );
            })}
          </div>

          {/* Not in base button */}
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <button onClick={() => { setShowModal(true); setSubmitted(false); setScheme(""); }} style={{ background: "none", border: `2px dashed ${C.amber}`, color: C.amber, borderRadius: 12, padding: "0.85rem 2rem", fontWeight: 600, cursor: "pointer", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <AlertTriangle size={18}/>{wt.notInBase}
            </button>
          </div>
        </div>

        {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <h2 style={{ fontWeight: 700, color: C.blue, marginBottom: "0.5rem" }}>{wt.modalTitle}</h2>
              <p style={{ color: C.gray, fontSize: 14, marginBottom: "1.25rem" }}>{wt.modalDesc}</p>
              {!submitted ? (
                  <>
                    <label style={{ fontSize: 13, fontWeight: 500, color: C.blue, display: "block", marginBottom: "0.4rem" }}>{wt.schemeLabel}</label>
                    <textarea
                        value={scheme}
                        onChange={e => setScheme(e.target.value)}
                        placeholder={wt.schemePh}
                        rows={5}
                        style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "0.75rem", fontSize: 14, resize: "vertical", boxSizing: "border-box", outline: "none", marginBottom: "1rem" }}
                    />
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                      <button onClick={() => setShowModal(false)} style={{ background: "none", border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "0.65rem 1.25rem", cursor: "pointer", color: C.gray }}>{wt.cancelBtn}</button>
                      <button onClick={() => setSubmitted(true)} disabled={!scheme.trim()} style={{ background: C.blue, color: "white", border: "none", borderRadius: 10, padding: "0.65rem 1.5rem", fontWeight: 600, cursor: scheme.trim() ? "pointer" : "not-allowed", opacity: scheme.trim() ? 1 : 0.5 }}>{wt.submitBtn}</button>
                    </div>
                  </>
              ) : (
                  <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                    <CheckCircle size={48} color={C.green} style={{ marginBottom: 12 }}/>
                    <p style={{ fontWeight: 600, color: C.green, fontSize: 15 }}>{wt.successMsg}</p>
                  </div>
              )}
            </Modal>
        )}
      </div>
  );
}