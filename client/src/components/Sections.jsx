import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

import state, { goPage, goCollection } from '../store';
import { STYLES, FEATURED, COLLECTIONS } from '../data/products';
import { whatsappLink } from '../config/brand';
import Tee from './Tee';
import DesignCard, { openEditor } from './DesignCard';
import Reveal from './Reveal';
import { SiteFooter } from './Social';

// home previews: a subset, with a "ver más" into the full section page
const FEATURED_PREVIEW = FEATURED.slice(0, 4);

const MARQUEE = ['SAU Urban', 'Camisetas personalizadas', 'Viste tu fe', 'Colombia como en el alma', 'Diseño 3D en tiempo real'];

const STEPS = [
  { n: '01', title: 'Elige', text: 'Escoge un diseño del catálogo o empieza desde cero con tu propia idea.' },
  { n: '02', title: 'Personaliza', text: 'Cambia el color, sube tu estampado al frente y a la espalda, y elige tu talla en 3D.' },
  { n: '03', title: 'Pide por WhatsApp', text: 'Envíanos tu pedido con un toque y coordinamos el pago y el envío contigo.' },
];

// numbered section eyebrow with a hairline
const Eyebrow = ({ n, label }) => (
  <p className="sec-eyebrow"><span>{n}</span> {label}</p>
);

const openStyle = (color) => {
  state.page = 'home';
  openEditor({ color });
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

    {/* Diseños destacados */}
    <section className="sec" id="disenos">
      <Reveal>
        <Eyebrow n="01" label="Diseños" />
        <div className="sec-head sec-head-row">
          <div>
            <h2 className="sec-title">Lo más <em>pedido</em></h2>
            <p className="sec-sub">Fe, Colombia y mensajes que inspiran, en camisetas y hoodies.</p>
          </div>
          <button className="sec-more" onClick={() => goPage('disenos')}>Ver todo →</button>
        </div>
      </Reveal>
      <div className="design-grid">
        {FEATURED_PREVIEW.map((d, i) => (
          <Reveal key={d.name} delay={i * 0.06}><DesignCard d={d} /></Reveal>
        ))}
      </div>
      <button className="btn-ghost sec-more-btn" onClick={() => goPage('disenos')}>Ver todos los diseños →</button>
    </section>

    {/* Colecciones */}
    <section className="sec" id="colecciones">
      <Reveal>
        <Eyebrow n="02" label="Colecciones" />
        <div className="sec-head sec-head-row">
          <div>
            <h2 className="sec-title">Elige tu <em>mensaje</em></h2>
            <p className="sec-sub">Explora por temas que hablan de lo que eres.</p>
          </div>
          <button className="sec-more" onClick={() => goPage('colecciones')}>Ver todo →</button>
        </div>
      </Reveal>
      <div className="coll-grid">
        {COLLECTIONS.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.06}>
            <button className={`coll-card w-full ${c.image ? 'has-photo' : ''}`} onClick={() => goCollection(c.id)}>
              {c.image && <img src={c.image} alt="" loading="lazy" className="coll-photo" />}
              <span className="coll-count">{c.count}</span>
              <span className="coll-name">{c.name}</span>
              <span className="coll-link">Ver colección →</span>
            </button>
          </Reveal>
        ))}
      </div>
    </section>

    {/* Elige tu estilo */}
    <section className="sec" id="estilo">
      <Reveal>
        <Eyebrow n="03" label="Estilo" />
        <div className="sec-head">
          <h2 className="sec-title">Tu corte, tu <em>estilo</em></h2>
          <p className="sec-sub">Toca una prenda para empezar a diseñarla en 3D.</p>
        </div>
      </Reveal>
      <div className="style-grid">
        {STYLES.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <button className="style-card w-full" onClick={() => openStyle(s.color)}>
              <div className="style-tee"><Tee color={s.color} variant={s.variant} /></div>
              <span className="style-label">{s.label}</span>
            </button>
          </Reveal>
        ))}
      </div>
    </section>

    {/* Cómo funciona */}
    <section className="sec" id="como-funciona">
      <Reveal>
        <Eyebrow n="04" label="Cómo funciona" />
        <div className="sec-head">
          <h2 className="sec-title">Tu prenda en <em>3 pasos</em></h2>
        </div>
      </Reveal>
      <div className="steps">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08} className="step">
            <span className="step-n" aria-hidden>{s.n}</span>
            <h3 className="step-title">{s.title}</h3>
            <p className="step-text">{s.text}</p>
          </Reveal>
        ))}
      </div>
    </section>

    {/* CTA final */}
    <section className="cta-final">
      <h2 className="cta-title">Lleva tu <em>fe</em><br />contigo.</h2>
      <p className="cta-sub">Diseña tu prenda en 3D o escríbenos y la personalizamos contigo.</p>
      <div className="cta-actions">
        <button className="btn-primary" onClick={() => openStyle()}>Personalizar ahora <span aria-hidden>→</span></button>
        <a className="btn-ghost" href={whatsappLink('¡Hola SAU! Quiero personalizar una prenda.')} target="_blank" rel="noopener noreferrer">
          <FaWhatsapp size={18} /> Escríbenos
        </a>
      </div>
    </section>

    <SiteFooter />
  </div>
);

export default Sections;
