import React from 'react';

import state, { addToCart, formatPrice, goPage } from '../store';
import { STYLES, FEATURED, COLLECTIONS } from '../data/products';
import Tee from './Tee';

const BagPlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="12" y1="10" x2="12" y2="16" />
    <line x1="9" y1="13" x2="15" y2="13" />
  </svg>
);

// home previews: a subset, with a "ver más" into the full section page
const FEATURED_PREVIEW = FEATURED.slice(0, 4);

const MARQUEE = ['Viste tu fe', 'Si Dios te dio la visión', 'Hecho con propósito', 'Diseño 3D en tiempo real'];

// numbered section eyebrow with a hairline — editorial "lookbook" separators
const Eyebrow = ({ n, label }) => (
  <p className="sec-eyebrow"><span>{n}</span> {label}</p>
);

const openEditor = ({ color, logo } = {}) => {
  if (color) state.color = color;
  if (logo) { state.logoDecal = logo; state.isLogoTexture = true; }
  state.activeView = 'front';
  state.page = 'home';
  state.intro = false;
};

const addItem = (e, d) => {
  e.stopPropagation();
  addToCart({ name: d.name, price: d.price, color: d.color, size: 'M', qty: 1 });
};

const Sections = () => (
  <div className="sections">
    {/* brand marquee — separates the hero from the content */}
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((t, i) => (
          <span key={i}>{t} <i>✦</i></span>
        ))}
      </div>
    </div>

    {/* Elige tu estilo */}
    <section className="sec" id="estilo">
      <Eyebrow n="01" label="Estilo" />
      <div className="sec-head">
        <h2 className="sec-title">Elige tu <em>estilo</em></h2>
        <p className="sec-sub">Encuentra el corte que mejor te representa.</p>
      </div>
      <div className="style-grid">
        {STYLES.map((s) => (
          <button className="style-card" key={s.label} onClick={() => openEditor({ color: s.color })}>
            <div className="style-tee"><Tee color={s.color} variant={s.variant} /></div>
            <span className="style-label">{s.label}</span>
          </button>
        ))}
      </div>
    </section>

    {/* Diseños destacados */}
    <section className="sec" id="disenos">
      <Eyebrow n="02" label="Diseños" />
      <div className="sec-head sec-head-row">
        <div>
          <h2 className="sec-title">Diseños <em>destacados</em></h2>
          <p className="sec-sub">Versículos y mensajes que inspiran tu fe.</p>
        </div>
        <button className="sec-more" onClick={() => goPage('disenos')}>Ver más →</button>
      </div>
      <div className="design-grid">
        {FEATURED_PREVIEW.map((d) => (
          <div className="design-card" key={d.name}>
            <div className="design-tee" onClick={() => openEditor(d)}>
              <Tee color={d.color} />
            </div>
            <div className="design-info">
              <span className="design-name">{d.name}</span>
              <span className="design-verse">{d.verse}</span>
              <span className="design-price">{formatPrice(d.price)}</span>
              <div className="design-actions">
                <button className="design-personalize" onClick={() => openEditor(d)}>Personalizar</button>
                <button className="design-add" onClick={(e) => addItem(e, d)} aria-label="Agregar al carrito"><BagPlusIcon /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="sec-more-btn" onClick={() => goPage('disenos')}>Ver todos los diseños →</button>
    </section>

    {/* Colecciones */}
    <section className="sec" id="colecciones">
      <Eyebrow n="03" label="Colecciones" />
      <div className="sec-head sec-head-row">
        <div>
          <h2 className="sec-title">Colecciones</h2>
          <p className="sec-sub">Explora por temas que hablan de lo que crees.</p>
        </div>
        <button className="sec-more" onClick={() => goPage('colecciones')}>Ver más →</button>
      </div>
      <div className="coll-grid">
        {COLLECTIONS.map((c) => (
          <button className="coll-card" key={c.name} style={{ background: c.color }} onClick={() => goPage('colecciones')}>
            <span className="coll-name">{c.name}</span>
            <span className="coll-count">{c.count}</span>
            <span className="coll-link">Ver colección →</span>
          </button>
        ))}
      </div>
    </section>

    {/* CTA final */}
    <section className="cta-final">
      <h2 className="cta-title">Lleva tu <em>fe</em> contigo.</h2>
      <p className="cta-sub">Diseña tu prenda en 3D y exprésala con tu propio estilo.</p>
      <button className="btn-beige" onClick={() => openEditor()}>Personalizar ahora <span aria-hidden>→</span></button>
    </section>

    <footer className="site-footer">
      <span className="footer-brand">VISTE TU FE</span>
      <span className="footer-copy">© {new Date().getFullYear()} · Hecho con fe.</span>
    </footer>
  </div>
);

export default Sections;
