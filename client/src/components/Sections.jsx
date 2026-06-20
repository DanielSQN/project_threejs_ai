import React from 'react';

import state from '../store';

const TShirt = ({ color }) => (
  <svg viewBox="0 0 120 120" className="tee-svg" aria-hidden>
    <path
      d="M44 16 L24 26 L14 44 L26 52 L34 46 L34 104 L86 104 L86 46 L94 52 L106 44 L96 26 L76 16 C76 26 68 32 60 32 C52 32 44 26 44 16 Z"
      fill={color}
      stroke="rgba(0,0,0,0.08)"
      strokeWidth="1.5"
    />
  </svg>
);

const CrossIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2h-4v6H4v4h6v10h4V12h6V8h-6z" /></svg>
);
const CubeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
);

const STYLES = [
  { label: 'Oversize', color: '#1c1c1c' },
  { label: 'Clásico', color: '#D8CFBE' },
  { label: 'Manga larga', color: '#2B3A55' },
  { label: 'Hoodie', color: '#6E7B6B' },
];

const FEATURED = [
  { name: 'Jesús es Rey', verse: 'Apocalipsis 19:16', price: '$89.900', color: '#1c1c1c' },
  { name: 'Todo lo puedo en Cristo', verse: 'Filipenses 4:13', price: '$89.900', color: '#D8CFBE' },
  { name: 'Jehová es mi pastor', verse: 'Salmo 23:1', price: '$89.900', color: '#2B3A55' },
  { name: 'La Visión', verse: 'Habacuc 2:2', price: '$94.900', color: '#A98B6A' },
];

const COLLECTIONS = [
  { name: 'Fe', count: '12 diseños', color: '#efe7d8' },
  { name: 'Esperanza', count: '8 diseños', color: '#e4e7ec' },
  { name: 'Propósito', count: '10 diseños', color: '#e9e2ef' },
];

const FEATURES = [
  { icon: <CubeIcon />, label: 'VISTA 3D\nINTERACTIVA' },
  { icon: <CrossIcon />, label: 'DISEÑOS\nCRISTIANOS' },
  { icon: <CrossIcon />, label: 'PERSONALIZACIÓN\nEN TIEMPO REAL' },
];

const Sections = () => {
  const goEditor = () => { state.intro = false; };

  return (
    <div className="sections">
      {/* Beneficios */}
      <div className="features features-section">
        {FEATURES.map((f) => (
          <div className="feature" key={f.label}>
            <span className="feature-icon">{f.icon}</span>
            <span className="feature-label">{f.label}</span>
          </div>
        ))}
      </div>

      {/* Elige tu estilo */}
      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-title">Elige tu estilo</h2>
          <p className="sec-sub">Encuentra el corte que mejor te representa.</p>
        </div>
        <div className="style-grid">
          {STYLES.map((s) => (
            <button className="style-card" key={s.label} onClick={goEditor}>
              <div className="style-tee"><TShirt color={s.color} /></div>
              <span className="style-label">{s.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Diseños destacados */}
      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-title">Diseños destacados</h2>
          <p className="sec-sub">Versículos y mensajes que inspiran tu fe.</p>
        </div>
        <div className="design-grid">
          {FEATURED.map((d) => (
            <button className="design-card" key={d.name} onClick={goEditor}>
              <div className="design-tee" style={{ background: '#f1ece2' }}>
                <TShirt color={d.color} />
              </div>
              <div className="design-info">
                <span className="design-name">{d.name}</span>
                <span className="design-verse">{d.verse}</span>
                <span className="design-price">{d.price}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Colecciones */}
      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-title">Colecciones</h2>
          <p className="sec-sub">Explora por temas que hablan de lo que crees.</p>
        </div>
        <div className="coll-grid">
          {COLLECTIONS.map((c) => (
            <button className="coll-card" key={c.name} style={{ background: c.color }} onClick={goEditor}>
              <span className="coll-name">{c.name}</span>
              <span className="coll-count">{c.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="cta-final">
        <h2 className="cta-title">Lleva tu fe contigo.</h2>
        <p className="cta-sub">Diseña tu prenda en 3D y exprésala con tu propio estilo.</p>
        <button className="btn-beige" onClick={goEditor}>Personalizar ahora <span aria-hidden>→</span></button>
      </section>

      <footer className="site-footer">
        <span className="footer-brand">VISTE TU FE</span>
        <span className="footer-copy">© {new Date().getFullYear()} · Hecho con fe.</span>
      </footer>
    </div>
  );
};

export default Sections;
