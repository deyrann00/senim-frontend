import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { C } from '../config/constants';

export default function ArticlePage({ t, id, setPage }) {

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fallback translations in case you don't have them in your i18n file yet
    const wt = t?.wiki || {
        back: "Назад к статьям",
        notFound: "Статья не найдена",
        category: "Категория"
    };

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://senim-backend-production.up.railway.app';

        // Fetch the specific article by ID
        fetch(`${baseUrl}/api/articles/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch article');
                return response.json();
            })
            .then(data => {
                // We do the same color/icon logic here so it matches the main page
                const categoryLow = (data.scamCategory || '').toLowerCase();
                let assignedColor = 'blue';
                let assignedIcon = '🛡️';

                if (categoryLow.includes('finance') || categoryLow.includes('investment')) {
                    assignedColor = 'amber'; assignedIcon = '💰';
                } else if (categoryLow.includes('social engineering') || categoryLow.includes('phone')) {
                    assignedColor = 'red'; assignedIcon = '📞';
                } else if (categoryLow.includes('e-commerce') || categoryLow.includes('shop')) {
                    assignedColor = 'green'; assignedIcon = '🛒';
                } else if (categoryLow.includes('phishing')) {
                    assignedColor = 'red'; assignedIcon = '🎣';
                }

                setArticle({
                    ...data,
                    color: assignedColor,
                    icon: assignedIcon
                });
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching article:', err);
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const colorMap = {
        blue: { bg: C.blueLight, icon: C.blue, text: C.blue },
        red: { bg: C.redLight, icon: C.red, text: C.red },
        amber: { bg: C.amberLight, icon: C.amber, text: C.amber },
        green: { bg: C.greenLight, icon: C.green, text: C.green },
    };

    if (loading) {
        return <div style={{ textAlign: "center", padding: "5rem", color: C.gray }}>Загрузка...</div>;
    }

    if (error || !article) {
        return (
            <div style={{ textAlign: "center", padding: "5rem", color: C.red }}>
                <AlertTriangle size={48} style={{ margin: "0 auto 1rem" }} />
                <h2>{error || wt.notFound}</h2>
                <button onClick={() => navigate(-1)} style={{ marginTop: "1rem", padding: "0.5rem 1rem", borderRadius: 8, border: `1px solid ${C.border}`, background: "white", cursor: "pointer" }}>
                    {wt.back}
                </button>
            </div>
        );
    }

    const cm = colorMap[article.color] || colorMap.blue;

    return (
        <div style={{ backgroundColor: "#f9fafb", minHeight: "100vh", paddingBottom: "4rem" }}>
            {/* Top Banner Area */}
            <section style={{ background: C.blue, padding: "2rem 1.25rem", color: "white" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <button
                        onClick={() => setPage("wiki")}
                        style={{ background: "none", border: "none", color: "white", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14, opacity: 0.8, marginBottom: "2rem", padding: 0 }}
                    >
                        <ArrowLeft size={16}/> {wt.back}
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 16, background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                            {article.icon}
                        </div>
                        <div>
               <span style={{ background: "rgba(255,255,255,0.2)", color: "white", fontSize: 12, padding: "4px 10px", borderRadius: 20, fontWeight: 500, display: "inline-block", marginBottom: 8 }}>
                 {article.scamCategory}
               </span>
                            <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{article.title}</h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Area */}
            <div style={{ maxWidth: 800, margin: "-2rem auto 0", padding: "0 1.25rem", position: "relative", zIndex: 10 }}>
                <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 16, padding: "2.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.03)" }}>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.5rem", borderBottom: `1px solid ${C.border}`, paddingBottom: "1.5rem" }}>
                        <span style={{ color: C.gray, fontSize: 14 }}>{wt.category}:</span>
                        <span style={{ background: cm.bg, color: cm.text, fontSize: 13, padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>
                 {article.scamCategory}
             </span>
                        {article.createdAt && (
                            <span style={{ marginLeft: "auto", color: C.gray, fontSize: 13 }}>
                     {new Date(article.createdAt).toLocaleDateString()}
                 </span>
                        )}
                    </div>

                    <div style={{ color: "#374151", fontSize: "1.05rem", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                        {article.content}
                    </div>

                </div>
            </div>
        </div>
    );
}