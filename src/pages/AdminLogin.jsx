import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { C } from '../config/constants';

export default function AdminLogin({ setPage, setIsAdmin }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        // Қарапайым құпия сөз / Простой хардкод пароль
        if (password === "senim2025") {
            setIsAdmin(true);
            setPage("admin");
        } else {
            setError("Құпия сөз қате / Неверный пароль");
        }
    };

    return (
        <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.25rem" }}>
            <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 16, padding: "2.5rem", maxWidth: 400, width: "100%", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, background: C.blueLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                    <Lock size={24} color={C.blue} />
                </div>
                <h2 style={{ fontWeight: 700, fontSize: "1.5rem", color: C.blue, marginBottom: "0.5rem" }}>Admin Panel</h2>
                <p style={{ color: C.gray, fontSize: 14, marginBottom: "2rem" }}>Жалғастыру үшін құпия сөзді енгізіңіз</p>

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <input
                        type="password"
                        value={password}
                        onChange={e => { setPassword(e.target.value); setError(""); }}
                        placeholder="Құпия сөз / Пароль"
                        style={{ padding: "0.85rem 1rem", border: `1.5px solid ${error ? C.red : C.border}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                    />
                    {error && <span style={{ color: C.red, fontSize: 13, textAlign: "left" }}>{error}</span>}

                    <button type="submit" style={{ background: C.blue, color: "white", border: "none", borderRadius: 10, padding: "0.85rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: "0.5rem" }}>
                        Кіру <ArrowRight size={16} />
                    </button>
                </form>

                <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: C.gray, fontSize: 13, cursor: "pointer", marginTop: "1.5rem" }}>
                    ← Басты бетке оралу
                </button>
            </div>
        </div>
    );
}