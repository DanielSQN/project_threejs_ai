import React, { useState, useEffect } from 'react';
import { useSnapshot } from 'valtio';

import state, { addToCart } from '../store';
import Canvas from '../canvas';
import { reader } from '../config/helpers';

/* ---------- icons ---------- */
const I = {
  back: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>,
  save: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>,
  bag: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>,
  bagPlus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="12" y1="10" x2="12" y2="16" /><line x1="9" y1="13" x2="15" y2="13" /></svg>,
  color: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".6" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".6" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".6" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.83-.44-1.12-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2C19.52 16.4 22 13.91 22 11c0-4.97-4.5-9-10-9z" /></svg>,
  design: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" /></svg>,
  view: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>,
  hand: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2" /><path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" /></svg>,
};

const COLORS = [
  { name: 'Arena', hex: '#D8CFBE' },
  { name: 'Negro', hex: '#1c1c1c' },
  { name: 'Tierra', hex: '#A98B6A' },
  { name: 'Blanco', hex: '#F3F1EA' },
  { name: 'Gris', hex: '#B7B7B2' },
  { name: 'Marino', hex: '#2B3A55' },
  { name: 'Salvia', hex: '#6E7B6B' },
];

const TOOLS = [
  { id: 'view', label: 'Vista', icon: I.view },
  { id: 'color', label: 'Color', icon: I.color },
  { id: 'design', label: 'Diseño', icon: I.design },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const Customizer = () => {
  const snap = useSnapshot(state);
  const [activeTool, setActiveTool] = useState('view'); // collapsed by default
  const expanded = activeTool !== 'view';

  // the editor is a fixed fullscreen overlay -> lock document scroll while open;
  // also start facing the front.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    state.shirtRotY = 0;
    state.activeView = 'front';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Frente/Espalda rotate to the nearest canonical side so the buttons always
  // match the side they name, even after a free drag.
  const setView = (v) => {
    const base = Math.round(state.shirtRotY / (Math.PI * 2)) * (Math.PI * 2);
    state.shirtRotY = v === 'back' ? base + Math.PI : base;
    state.activeView = v;
  };
  const handleAddToCart = () => {
    addToCart({ name: 'Diseño personalizado', price: 99900, color: snap.color, size: snap.size, qty: snap.quantity });
  };

  const uploadDesign = (side, e) => {
    const file = e.target.files[0];
    if (!file) return;
    reader(file).then((result) => {
      if (side === 'back') { state.logoDecalBack = result; state.isLogoBack = true; }
      else { state.logoDecal = result; state.isLogoTexture = true; }
    });
    e.target.value = '';
  };
  const removeDesign = (side) => {
    if (side === 'back') state.isLogoBack = false;
    else state.isLogoTexture = false;
  };

  const DesignCol = ({ side, label, decal, active }) => {
    const id = `cz-file-${side}`;
    return (
      <div className="cz-dcol">
        <p className="cz-dcol-label">{label}</p>
        {active ? (
          <div className="cz-preview">
            <img src={decal} alt={label} />
            <button className="cz-preview-x" onClick={() => removeDesign(side)} aria-label="Eliminar">×</button>
          </div>
        ) : (
          <label htmlFor={id} className="cz-preview cz-preview-empty">
            <span>＋</span>
            <span className="cz-preview-hint">Subir</span>
          </label>
        )}
        <input id={id} type="file" accept="image/*" hidden onChange={(e) => uploadDesign(side, e)} />
      </div>
    );
  };

  const ToolControls = () => {
    if (activeTool === 'color') {
      return (
        <>
          <p className="cz-menu-title">Color de la prenda</p>
          <div className="cz-swatches">
            {COLORS.map((c) => (
              <button
                key={c.hex}
                className={`cz-swatch ${snap.color.toLowerCase() === c.hex.toLowerCase() ? 'active' : ''}`}
                style={{ background: c.hex }}
                onClick={() => (state.color = c.hex)}
                aria-label={c.name}
              />
            ))}
          </div>
        </>
      );
    }
    if (activeTool === 'design') {
      return (
        <>
          <p className="cz-menu-title">Diseño de la prenda</p>
          <div className="cz-dcols">
            <DesignCol side="front" label="Frontal" decal={snap.logoDecal} active={snap.isLogoTexture} />
            <DesignCol side="back" label="Espalda" decal={snap.logoDecalBack} active={snap.isLogoBack} />
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="customizer">
      {/* fullscreen 3D shirt in the background */}
      <div className="cz-canvas-full"><Canvas /></div>

      {/* top bar */}
      <header className="cz-top">
        <button className="cz-back" onClick={() => (state.intro = true)}>{I.back} <span className="cz-back-t">Volver</span></button>
        <div className="cz-top-right">
          <select className="cz-size" value={snap.size} onChange={(e) => (state.size = e.target.value)}>
            {SIZES.map((s) => <option key={s} value={s}>Talla {s}</option>)}
          </select>
          <button className="cz-cart" onClick={handleAddToCart}>
            {I.bagPlus} <span className="cz-cart-t">Agregar al carrito</span>
          </button>
        </div>
      </header>

      {/* rotate hint above the shirt */}
      <p className="cz-rotate-hint">{I.hand} Arrastra para rotar la prenda</p>

      {/* bottom area: front/back toggle + collapsible (icon-only) tool menu */}
      <div className="cz-bottom">
        <div className="cz-viewtoggle">
          <button className={snap.activeView === 'front' ? 'active' : ''} onClick={() => setView('front')}>Frente</button>
          <button className={snap.activeView === 'back' ? 'active' : ''} onClick={() => setView('back')}>Espalda</button>
        </div>

        <div className={`cz-menu ${expanded ? 'expanded' : ''}`}>
          {expanded && (
            <div className="cz-menu-panel">
              <ToolControls />
            </div>
          )}
          <div className="cz-tabs">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                className={`cz-tab ${activeTool === t.id ? 'active' : ''}`}
                onClick={() => setActiveTool(activeTool === t.id ? 'view' : t.id)}
                aria-label={t.label}
                title={t.label}
              >
                <span className="cz-tab-icon">{t.icon}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Customizer
