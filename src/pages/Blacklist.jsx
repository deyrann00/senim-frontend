import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { C, BLACKLIST_DATA } from '../config/constants';
import { Badge } from '../components/UI';

export default function BlacklistPage({ t }) {
  const [search, setSearch] = useState("");
  // Инициализируем фильтры значением "Все" из текущего языка
  const [filterType, setFilterType] = useState(t.blacklist.all);
  const [filterStatus, setFilterStatus] = useState(t.blacklist.all);
  const bt = t.blacklist;

  const types = [bt.all, ...Array.from(new Set(BLACKLIST_DATA.map(d => d.type)))];
  const statuses = [bt.all, "Расталған алаяқтық", "Тергелуде", "Бақылауда"];

  const filtered = useMemo(() =>
    BLACKLIST_DATA.filter(d => {
      const q = search.toLowerCase();
      const ms = !q || d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q) || d.region.toLowerCase().includes(q);
      const mt = filterType === bt.all || d.type === filterType;
      const mst = filterStatus === bt.all || d.status === filterStatus;
      return ms && mt && mst;
    }), [search, filterType, filterStatus, bt.all]);

  return (
    <div>
      <section style={{ background: C.blue, padding: "3rem 1.25rem 2.5rem", textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>{bt.title}</h1>
        <p style={{ opacity: 0.8 }}>{bt.sub}</p>
      </section>
      
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.25rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 240px" }}>
            <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.gray }}/>
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder={bt.searchPh}
              style={{ width: "100%", padding: "0.65rem 1rem 0.65rem 2.4rem", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, boxSizing: "border-box", outline: "none" }} 
            />
          </div>
          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)} 
            style={{ padding: "0.65rem 1rem", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, background: "white", cursor: "pointer", outline: "none" }}
          >
            {types.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)} 
            style={{ padding: "0.65rem 1rem", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, background: "white", cursor: "pointer", outline: "none" }}
          >
            {statuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>

        <div style={{ background: "white", border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "0.75rem 1.25rem", background: C.grayLight, display: "grid", gridTemplateColumns: "2fr 1.5fr 1.2fr 1fr 0.8fr", gap: "1rem", fontSize: 12, fontWeight: 600, color: C.gray, textTransform: "uppercase" }}>
            {bt.cols.map(c => <span key={c}>{c}</span>)}
          </div>
          
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: C.gray }}>{bt.noResults}</div> 
          ) : (
            filtered.map((d, i) => (
              <div key={d.id} style={{ padding: "1rem 1.25rem", display: "grid", gridTemplateColumns: "2fr 1.5fr 1.2fr 1fr 0.8fr", gap: "1rem", alignItems: "center", borderTop: i === 0 ? "none" : `1px solid ${C.border}` }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: C.blue, margin: 0 }}>{d.name}</p>
                  <p style={{ fontSize: 12, color: C.gray, margin: 0 }}>{bt.registered} {d.reported}</p>
                </div>
                <span style={{ fontSize: 13, color: "#374151" }}>{d.type}</span>
                <Badge status={d.status}/>
                <span style={{ fontSize: 13, color: "#374151" }}>{d.region}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.red }}>{d.victims}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}