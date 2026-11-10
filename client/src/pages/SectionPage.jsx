import React from 'react';
import { useSnapshot } from 'valtio';

import state, { goBackHome, goCollection } from '../store';
import { canGoBack } from '../hooks/useHistorySync';

// vuelve a la pantalla anterior (y a donde estabas en ella); si se entró
// directo por enlace, va al inicio
const back = () => (canGoBack() ? window.history.back() : goBackHome());
import { FEATURED, COLLECTIONS } from '../data/products';
import Navbar from '../components/Navbar';
import DesignCard, { openEditor } from '../components/DesignCard';
import { SiteFooter } from '../components/Social';

const DesignsPage = ({ collection }) => {
  const coll = COLLECTIONS.find((c) => c.id === collection);
  const items = coll ? FEATURED.filter((d) => d.collection === coll.id) : FEATURED;
  return (
    <>
      <div className="page-head">
        <button className="page-back" onClick={back}>← Volver</button>
        <h1 className="page-title">{coll ? coll.name : 'Diseños'}</h1>
        <p className="page-sub">{coll ? coll.desc : 'Fe, Colombia y mensajes que inspiran.'} Toca un diseño para personalizarlo en 3D.</p>
      </div>
      <div className="coll-filter">
        <button className={!coll ? 'active' : ''} onClick={() => (state.collection = null)}>Todos</button>
        {COLLECTIONS.map((c) => (
          <button key={c.id} className={coll?.id === c.id ? 'active' : ''} onClick={() => (state.collection = c.id)}>{c.name}</button>
        ))}
      </div>
      <div className="page-grid">
        {items.map((d) => <DesignCard d={d} key={d.name} />)}
      </div>
    </>
  );
};

const CollectionsPage = () => (
  <>
    <div className="page-head">
      <button className="page-back" onClick={back}>← Volver</button>
      <h1 className="page-title">Colecciones</h1>
      <p className="page-sub">Explora por temas que hablan de lo que eres.</p>
    </div>
    <div className="page-coll-grid">
      {COLLECTIONS.map((c) => (
        <button className={`page-coll-card ${c.image ? 'has-photo' : ''}`} key={c.id} onClick={() => goCollection(c.id)}>
          {c.image && <img src={c.image} alt="" loading="lazy" className="coll-photo" />}
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

  return (
    <section className="section-page">
      <Navbar />
      <div className="page-body">
        {snap.page === 'colecciones' ? <CollectionsPage /> : <DesignsPage collection={snap.collection} />}

        <section className="cta-final">
          <h2 className="cta-title">Diseña la <em>tuya.</em></h2>
          <p className="cta-sub">Personaliza color, estampado y talla en 3D, o pídela por WhatsApp.</p>
          <button className="btn-primary" onClick={() => openEditor()}>Personalizar ahora <span aria-hidden>→</span></button>
        </section>

        <SiteFooter />
      </div>
    </section>
  );
};

export default SectionPage;
