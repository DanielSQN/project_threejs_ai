import React from 'react';

import state, { goPage, goCollection } from '../store';
import { STYLES, FEATURED, COLLECTIONS } from '../data/products';
import Tee from './Tee';
import DesignCard from './DesignCard';
import { SiteFooter } from './Social';

// home previews: a subset, with a "ver más" into the full section page
const FEATURED_PREVIEW = FEATURED.slice(0, 4);

const MARQUEE = ['SAU Urban', 'Camisetas personalizadas', 'Viste tu fe', 'Colombia como en el alma', 'Diseño 3D en tiempo real'];

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
          <p className="sec-sub">Fe, Colombia y mensajes que inspiran, en camisetas y hoodies.</p>
        </div>
        <button className="sec-more" onClick={() => goPage('disenos')}>Ver más →</button>
      </div>
      <div className="design-grid">
        {FEATURED_PREVIEW.map((d) => <DesignCard d={d} key={d.name} />)}
      </div>
      <button className="sec-more-btn" onClick={() => goPage('disenos')}>Ver todos los diseños →</button>
    </section>

    {/* Colecciones */}
    <section className="sec" id="colecciones">
      <Eyebrow n="03" label="Colecciones" />
      <div className="sec-head sec-head-row">
        <div>
          <h2 className="sec-title">Colecciones</h2>
          <p className="sec-sub">Explora por temas que hablan de lo que eres.</p>
        </div>
        <button className="sec-more" onClick={() => goPage('colecciones')}>Ver más →</button>
      </div>
      <div className="coll-grid">
        {COLLECTIONS.map((c) => (
          <button className={`coll-card ${c.image ? 'has-photo' : ''}`} key={c.name} style={{ background: c.color }} onClick={() => goCollection(c.id)}>
            {c.image && <img src={c.image} alt="" loading="lazy" className="coll-photo" />}
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
      <p className="cta-sub">Diseña tu prenda en 3D o escríbenos y la personalizamos contigo.</p>
      <button className="btn-beige" onClick={() => openEditor()}>Personalizar ahora <span aria-hidden>→</span></button>
    </section>

    <SiteFooter />
  </div>
);

export default Sections;
