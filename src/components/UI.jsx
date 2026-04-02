
import React from 'react';
import { X } from 'lucide-react';
import { C } from '../config/constants';

export function Badge({ status }) {
  const map = {
    "Расталған алаяқтық": { bg:"#fee2e2", color:"#991b1b", dot:"#dc2626" },
    "Тергелуде": { bg:"#fef3c7", color:"#92400e", dot:"#d97706" },
    "Бақылауда": { bg:"#e0f2fe", color:"#075985", dot:"#0284c7" },
  };
  const s = map[status] || map["Бақылауда"];
  return (
    <span style={{ background:s.bg, color:s.color, fontSize:12, fontWeight:500, padding:"3px 10px", borderRadius:20, display:"inline-flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
      <span style={{ width:7, height:7, borderRadius:"50%", background:s.dot, display:"inline-block" }} />{status}
    </span>
  );
}

export function DiffBadge({ level }) {
  const map = { "Бастапқы":["#d1fae5","#065f46"], "Орташа":["#fef3c7","#92400e"], "Жоғары":["#fee2e2","#991b1b"], "Начальный":["#d1fae5","#065f46"], "Средний":["#fef3c7","#92400e"], "Высокий":["#fee2e2","#991b1b"] };
  const [bg, c] = map[level] || map["Бастапқы"];
  return <span style={{ background:bg, color:c, fontSize:11, fontWeight:500, padding:"2px 9px", borderRadius:20 }}>{level}</span>;
}

export function OcrProgress({ progress }) {
  return (
    <div style={{ padding:"1.5rem", textAlign:"center" }}>
      <div style={{ fontSize:13, color:C.blue, fontWeight:600, marginBottom:"0.75rem" }}>
        AI чатты оқуда... {Math.round(progress * 100)}%
      </div>
      <div style={{ background:C.grayLight, borderRadius:20, height:10, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${progress*100}%`, background:`linear-gradient(90deg, ${C.green}, ${C.blue})`, borderRadius:20, transition:"width 0.3s ease" }} />
      </div>
    </div>
  );
}

export function Modal({ children, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:"white", borderRadius:20, padding:"2rem", maxWidth:500, width:"100%", position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", cursor:"pointer", color:C.gray }}><X size={20}/></button>
        {children}
      </div>
    </div>
  );
}

export function CertModal({ t, onClose }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ textAlign:"center", padding:"1rem 0" }}>
        <div style={{ fontSize:64, marginBottom:"1rem" }}>🏆</div>
        <h2 style={{ fontWeight:800, color:C.blue, fontSize:"1.5rem", marginBottom:"0.5rem" }}>{t.certTitle}</h2>
        <p style={{ color:C.gray, marginBottom:"1.5rem" }}>{t.certSub}</p>
        <button onClick={onClose} style={{ background:C.blue, color:"white", border:"none", borderRadius:10, padding:"0.75rem 2rem", fontWeight:600, cursor:"pointer" }}>{t.certClose}</button>
      </div>
    </Modal>
  );
}