import React, { useState, useEffect } from 'react';
import { Shield, BookOpen, Award, Database, Info, Globe, Menu, X, LayoutDashboard } from 'lucide-react';
import { C } from '../config/constants';

export function Navbar({ page, setPage, lang, setLang, t, safetyScore }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Отслеживаем размер экрана для переключения на мобильный вид
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 850);
    checkMobile(); // Проверяем при загрузке
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const links = [
    { id:"home", label:t.nav.home, icon:<Shield size={15}/> },
    { id:"wiki", label:t.nav.wiki, icon:<BookOpen size={15}/> },
    { id:"academy", label:t.nav.academy, icon:<Award size={15}/> },
    { id:"blacklist", label:t.nav.blacklist, icon:<Database size={15}/> },
    { id:"about", label:t.nav.about, icon:<Info size={15}/> },
    { id: "admin", label: "Admin", icon: <LayoutDashboard size={15}/> }
  ];

  return (
    <nav style={{ background:C.blue, position:"sticky", top:0, zIndex:50, boxShadow:"0 2px 12px rgba(0,0,0,0.18)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 1.25rem", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
        
        {/* ЛОГОТИП */}
        <button onClick={()=>setPage("home")} style={{ display:"flex", alignItems:"center", gap:9, background:"none", border:"none", cursor:"pointer", padding:0 }}>
          <div style={{ background:C.green, borderRadius:8, padding:"5px 7px", display:"flex" }}><Shield size={18} color="white"/></div>
          <span style={{ color:"white", fontWeight:600, fontSize:18 }}>Senim<span style={{ color:"#6ee7b7" }}>Wiki</span></span>
        </button>

        {/* НАВИГАЦИЯ ДЛЯ ПК */}
        {!isMobile && (
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            {links.map(l => (
              <button key={l.id} onClick={()=>setPage(l.id)} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 13px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:500, background:page===l.id?"rgba(255,255,255,0.15)":"transparent", color:page===l.id?"white":"rgba(255,255,255,0.7)" }}>
                {l.icon}{l.label}
              </button>
            ))}
            {safetyScore > 0 && (
              <div style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(255,255,255,0.12)", borderRadius:8, padding:"5px 10px", marginLeft:4 }}>
                <Shield size={13} color="#6ee7b7"/>
                <span style={{ color:"#6ee7b7", fontSize:12, fontWeight:700 }}>{safetyScore}%</span>
              </div>
            )}
            <button onClick={() => setLang(l => l==="kz"?"ru":"kz")} style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(255,255,255,0.12)", borderRadius:8, padding:"5px 10px", border:"none", cursor:"pointer", color:"white", fontSize:12, fontWeight:500, marginLeft:4 }}>
              <Globe size={13}/>{lang==="kz"?"RU":"KZ"}
            </button>
          </div>
        )}

        {/* ПАНЕЛЬ ДЛЯ МОБИЛОК (Язык, Рейтинг, Бургер) */}
        {isMobile && (
          <div style={{ display:"flex", alignItems:"center", gap: 8 }}>
            {safetyScore > 0 && (
              <div style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(255,255,255,0.12)", borderRadius:8, padding:"4px 8px" }}>
                <Shield size={12} color="#6ee7b7"/>
                <span style={{ color:"#6ee7b7", fontSize:12, fontWeight:700 }}>{safetyScore}%</span>
              </div>
            )}
            <button onClick={() => setLang(l => l==="kz"?"ru":"kz")} style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(255,255,255,0.12)", borderRadius:8, padding:"4px 8px", border:"none", cursor:"pointer", color:"white", fontSize:12, fontWeight:500 }}>
              <Globe size={12}/>{lang==="kz"?"RU":"KZ"}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} style={{ background:"none", border:"none", color:"white", padding:0, display:"flex", alignItems:"center" }}>
              {isOpen ? <X size={26}/> : <Menu size={26}/>}
            </button>
          </div>
        )}
      </div>

      {/* ВЫПАДАЮЩЕЕ БУРГЕР-МЕНЮ (Только для мобилок) */}
      {isMobile && isOpen && (
        <div style={{ background:C.blueMid, padding:"1rem", display:"flex", flexDirection:"column", gap:"0.5rem", borderTop:`1px solid rgba(255,255,255,0.1)` }}>
          {links.map(l => (
            <button 
              key={l.id} 
              onClick={()=>{ setPage(l.id); setIsOpen(false); }} 
              style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 15px", borderRadius:8, border:"none", cursor:"pointer", fontSize:15, fontWeight:500, background:page===l.id?"rgba(255,255,255,0.15)":"transparent", color:page===l.id?"white":"rgba(255,255,255,0.7)", textAlign:"left" }}
            >
              {l.icon}{l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

export function Footer({ t }) {
  const ft = t.footer;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <footer style={{ background:C.blue, color:"rgba(255,255,255,0.7)", marginTop:"auto" }}>
      {/* Меняем flexDirection на column для мобильных */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"2.5rem 1.25rem", display:"flex", flexDirection: isMobile ? "column" : "row", justifyContent:"space-between", gap:"2rem" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <Shield size={18} color="#6ee7b7"/><span style={{ color:"white", fontWeight:600, fontSize:16 }}>SenimWiki</span>
          </div>
          <p style={{ fontSize:13, lineHeight:1.7, maxWidth:280 }}>{ft.tagline}</p>
        </div>
        
        {/* Выравнивание текста меняется в зависимости от экрана */}
        <div style={{ textAlign: isMobile ? "left" : "right" }}>
          <p style={{ color:"white", fontWeight:500, fontSize:13, marginBottom:10 }}>{ft.contact}</p>
          <p style={{ fontSize:13, marginBottom:4 }}>info@senimwiki.kz</p>
          <p style={{ fontSize:13, marginBottom:4 }}>+7 (727) 000-0000</p>
          <p style={{ fontSize:13 }}>Алматы қ., Қазақстан</p>
        </div>
      </div>
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", textAlign:"center", padding:"1rem", fontSize:12 }}>{ft.copyright}</div>
    </footer>
  );
}
