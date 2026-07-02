import React, { useEffect } from 'react';
import { useSnapshot } from 'valtio';

import state, { addToCart, formatPrice, goPage } from '../store';
import { FEATURED, COLLECTIONS } from '../data/products';
import Navbar from '../components/Navbar';
import Tee from '../components/Tee';

const BagPlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="12" y1="10" x2="12" y2="16" /><line x1="9" y1="13" x2="15" y2="13" />
  </svg>
);

const openEditor = (d = {}) => {
  if (d.color) state.color = d.color;
  if (d.logo) { state.logoDecal = d.logo; state.isLogoTexture = true; }
  state.activeView = 'front';
  // keep state.page so "Volver" returns to the section page you came from
  state.intro = false;
};

const DesignsPage = () => (
  <>
    <div className="page-head">
      <button className="page-back" onClick={() => goPage('home')}>← Inicio</button>
      <h1 className="page-title">Diseños</h1>
      <p className="page-sub">Versículos y mensajes que inspiran tu fe. Toca un diseño para personalizarlo en 3D.</p>
    </div>
    <div className="page-grid">
      {FEATURED.map((d) => (
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
              <button className="design-add" onClick={(e) => { e.stopPropagation(); addToCart({ name: d.name, price: d.price, color: d.color, size: 'M', qty: 1 }); }} aria-label="Agregar al carrito"><BagPlusIcon /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </>
);

const CollectionsPage = () => (
  <>
    <div className="page-head">
      <button className="page-back" onClick={() => goPage('home')}>← Inicio</button>
      <h1 className="page-title">Colecciones</h1>
      <p className="page-sub">Explora por temas que hablan de lo que crees.</p>
    </div>
    <div className="page-coll-grid">
      {COLLECTIONS.map((c) => (
        <button className="page-coll-card" key={c.id} style={{ background: c.color }} onClick={() => goPage('disenos')}>
          <span className="coll-count">{c.count}</span>
          <span className="page-coll-name">{c.name}</span>
          <span className="page-coll-desc">{c.desc}</span>
          <span className="coll-link">Ver diseños →</span>
        </button>
      ))}
    </div>
  </>
);

const TITLES = { disenos: 'Diseños', colecciones: 'Colecciones' };

const SectionPage = () => {
  const snap = useSnapshot(state);

  // each page starts at the top
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [snap.page]);

  return (
    <section className="section-page">
      <Navbar />
      <div className="page-body">
        {snap.page === 'colecciones' ? <CollectionsPage /> : <DesignsPage />}

        <section className="cta-final">
          <h2 className="cta-title">Diseña la tuya.</h2>
          <p className="cta-sub">Personaliza color, estampado y talla en 3D.</p>
          <button className="btn-beige" onClick={() => openEditor()}>Personalizar ahora <span aria-hidden>→</span></button>
        </section>

        <footer className="site-footer">
          <span className="footer-brand">VISTE TU FE</span>
          <span className="footer-copy">© {new Date().getFullYear()} · Hecho con fe.</span>
        </footer>
      </div>
    </section>
  );
};

export default SectionPage;
