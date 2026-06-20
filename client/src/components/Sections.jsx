import React from 'react';

import state from '../store';

/* ---- t-shirt silhouettes per style ---- */
const TEE = {
  classic: 'M44 16 L24 26 L14 44 L26 52 L34 46 L34 104 L86 104 L86 46 L94 52 L106 44 L96 26 L76 16 C76 26 68 32 60 32 C52 32 44 26 44 16 Z',
  oversize: 'M40 18 L16 30 L8 52 L24 60 L30 52 L30 108 L90 108 L90 52 L96 60 L112 52 L104 30 L80 18 C80 28 71 34 60 34 C49 34 40 28 40 18 Z',
  long: 'M44 16 L24 26 L12 96 L26 100 L34 52 L34 104 L86 104 L86 52 L94 100 L108 96 L96 26 L76 16 C76 26 68 32 60 32 C52 32 44 26 44 16 Z',
  hoodie: 'M44 26 L24 34 L14 52 L26 60 L34 54 L34 104 L86 104 L86 54 L94 60 L106 52 L96 34 L76 26 Z',
};

const TShirt = ({ color, variant = 'classic' }) => (
  <svg viewBox="0 0 120 120" className="tee-svg" aria-hidden>
    {variant === 'hoodie' && (
      <path d="M40 28 C40 10 80 10 80 28 C80 34 73 38 60 38 C47 38 40 34 40 28 Z" fill={color} stroke="rgba(0,0,0,0.10)" strokeWidth="1.5" />
    )}
    <path d={TEE[variant]} fill={color} stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
    {variant === 'hoodie' && (
      <>
        <line x1="55" y1="38" x2="54" y2="54" stroke="rgba(0,0,0,0.22)" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="65" y1="38" x2="66" y2="54" stroke="rgba(0,0,0,0.22)" strokeWidth="1.6" strokeLinecap="round" />
      </>
    )}
  </svg>
);

const CrossIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2h-4v6H4v4h6v10h4V12h6V8h-6z" /></svg>
);
const CubeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
);
const BagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
);

const STYLES = [
  { label: 'Clásico', color: '#D8CFBE', variant: 'classic' },
  { label: 'Oversize', color: '#1c1c1c', variant: 'oversize' },
  { label: 'Manga larga', color: '#2B3A55', variant: 'long' },
  { label: 'Hoodie', color: '#6E7B6B', variant: 'hoodie' },
];

const FEATURED = [
  { name: 'Jesús es Rey', verse: 'Apocalipsis 19:16', price: '$89.900', color: '#1c1c1c', logo: './brand-logo.png' },
  { name: 'Todo lo puedo en Cristo', verse: 'Filipenses 4:13', price: '$89.900', color: '#D8CFBE', logo: './brand-logo.png' },
  { name: 'Jehová es mi pastor', verse: 'Salmo 23:1', price: '$89.900', color: '#2B3A55', logo: './brand-logo.png' },
  { name: 'La Visión', verse: 'Habacuc 2:2', price: '$94.900', color: '#A98B6A', logo: './brand-logo.png' },
];

const COLLECTIONS = [
  { name: 'Fe', count: '12 diseños', color: '#efe7d8' },
  { name: 'Esperanza', count: '8 diseños', color: '#e4e7ec' },
  { name: 'Propósito', count: '10 diseños', color: '#e9e2ef' },
];

const FEATURES = [
  { icon: <CubeIcon />, label: 'VISTA 3D\nREALISTA' },
  { icon: <CrossIcon />, label: 'DISEÑOS\nEXCLUSIVOS' },
  { icon: <CrossIcon />, label: 'PERSONALIZACIÓN\nINSTANTÁNEA' },
];

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const Sections = () => {
  // Open the 3D editor with the chosen design (color + print) already applied
  const openEditor = ({ color, logo } = {}) => {
    if (color) state.color = color;
    if (logo) { state.logoDecal = logo; state.isLogoTexture = true; }
    state.activeView = 'front';
    state.intro = false;
  };

  const addToCart = (e) => {
    e.stopPropagation();
    state.cartCount += 1;
  };

  return (
    <div className="sections">
      {/* Beneficios */}
      <div className="features features-section" id="beneficios">
        {FEATURES.map((f) => (
          <div className="feature" key={f.label}>
            <span className="feature-icon">{f.icon}</span>
            <span className="feature-label">{f.label}</span>
          </div>
        ))}
      </div>

      {/* Elige tu estilo */}
      <section className="sec" id="estilo">
        <div className="sec-head">
          <h2 className="sec-title">Elige tu estilo</h2>
          <p className="sec-sub">Encuentra el corte que mejor te representa.</p>
        </div>
        <div className="style-grid">
          {STYLES.map((s) => (
            <button className="style-card" key={s.label} onClick={() => openEditor({ color: s.color })}>
              <div className="style-tee"><TShirt color={s.color} variant={s.variant} /></div>
              <span className="style-label">{s.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Diseños destacados */}
      <section className="sec" id="disenos">
        <div className="sec-head">
          <h2 className="sec-title">Diseños destacados</h2>
          <p className="sec-sub">Versículos y mensajes que inspiran tu fe.</p>
        </div>
        <div className="design-grid">
          {FEATURED.map((d) => (
            <button className="design-card" key={d.name} onClick={() => openEditor(d)}>
              <div className="design-tee">
                <TShirt color={d.color} />
              </div>
              <div className="design-info">
                <span className="design-name">{d.name}</span>
                <span className="design-verse">{d.verse}</span>
                <div className="design-bottom">
                  <span className="design-price">{d.price}</span>
                  <span className="design-add" onClick={addToCart} role="button" aria-label="Agregar al carrito"><BagIcon /></span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Colecciones (no abren el editor: llevan a Diseños) */}
      <section className="sec" id="colecciones">
        <div className="sec-head">
          <h2 className="sec-title">Colecciones</h2>
          <p className="sec-sub">Explora por temas que hablan de lo que crees.</p>
        </div>
        <div className="coll-grid">
          {COLLECTIONS.map((c) => (
            <button className="coll-card" key={c.name} style={{ background: c.color }} onClick={() => scrollTo('disenos')}>
              <span className="coll-name">{c.name}</span>
              <span className="coll-count">{c.count}</span>
              <span className="coll-link">Ver colección →</span>
            </button>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="cta-final">
        <h2 className="cta-title">Lleva tu fe contigo.</h2>
        <p className="cta-sub">Diseña tu prenda en 3D y exprésala con tu propio estilo.</p>
        <button className="btn-beige" onClick={() => openEditor()}>Personalizar ahora <span aria-hidden>→</span></button>
      </section>

      <footer className="site-footer">
        <span className="footer-brand">VISTE TU FE</span>
        <span className="footer-copy">© {new Date().getFullYear()} · Hecho con fe.</span>
      </footer>
    </div>
  );
};

export default Sections;
