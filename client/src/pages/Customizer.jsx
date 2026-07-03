import React, { useState, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';

import state, { addToCart } from '../store';
import Canvas from '../canvas';
import { recenter, resetCam } from '../canvas/cameraControl';
import { reader } from '../config/helpers';

/* ---------- icons ---------- */
const I = {
  back: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>,
  recenter: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3.2" /><line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" /></svg>,
  bagPlus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="12" y1="10" x2="12" y2="16" /><line x1="9" y1="13" x2="15" y2="13" /></svg>,
  color: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".6" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".6" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".6" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.83-.44-1.12-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2C19.52 16.4 22 13.91 22 11c0-4.97-4.5-9-10-9z" /></svg>,
  design: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" /></svg>,
  view: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>,
  size: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" /><path d="M7 4v6M17 4v6M12 4v3" /><rect x="3" y="12" width="18" height="8" rx="1.5" /></svg>,
  hand: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2" /><path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" /></svg>,
  upload: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
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
  { id: 'size', label: 'Talla', icon: I.size },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// print offset ranges on the shirt (same for front/back)
const PAD = { x: 0.08, yMin: -0.12, yMax: 0.1 };

const KEYS = {
  front: { scale: 'logoScale', x: 'logoOffsetX', y: 'logoOffsetY' },
  back: { scale: 'logoBackScale', x: 'logoBackOffsetX', y: 'logoBackOffsetY' },
};

// Turn the shirt to the nearest canonical side so the Frente/Espalda buttons
// (and the pad) always match the side they name, even after a free drag.
const turnTo = (v) => {
  const base = Math.round(state.shirtRotY / (Math.PI * 2)) * (Math.PI * 2);
  state.shirtRotY = v === 'back' ? base + Math.PI : base;
  state.activeView = v;
};

// One compact matrix split in two: the left half positions the FRONT print and
// the right half the BACK print. The uploaded design itself is the handle, and
// starting a drag turns the shirt to that side so you see the change live.
// Top-level component so re-renders while dragging never remount it (which
// would drop the pointer capture).
const DesignPad = () => {
  const snap = useSnapshot(state);
  const ref = useRef(null);
  const dragSide = useRef(null);

  const place = (e) => {
    const side = dragSide.current;
    if (!side) return;
    const r = ref.current.getBoundingClientRect();
    const half = r.width / 2;
    const x0 = side === 'front' ? r.left : r.left + half;
    const nx = Math.min(1, Math.max(0, (e.clientX - x0) / half));
    const ny = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    const k = KEYS[side];
    state[k.x] = -PAD.x + nx * PAD.x * 2;
    state[k.y] = PAD.yMax - ny * (PAD.yMax - PAD.yMin);
  };

  const down = (e) => {
    const r = ref.current.getBoundingClientRect();
    const side = e.clientX - r.left < r.width / 2 ? 'front' : 'back';
    const active = side === 'back' ? state.isLogoBack : state.isLogoTexture;
    if (!active) return; // nothing to drag on that half
    dragSide.current = side;
    turnTo(side); // show that side while you position it
    e.currentTarget.setPointerCapture(e.pointerId);
    place(e);
  };

  const posFor = (side) => {
    const k = KEYS[side];
    const nx = (snap[k.x] + PAD.x) / (PAD.x * 2);
    const ny = (PAD.yMax - snap[k.y]) / (PAD.yMax - PAD.yMin);
    return {
      left: `${(side === 'front' ? 0 : 50) + nx * 50}%`,
      top: `${ny * 100}%`,
      width: `${12 * snap[k.scale]}%`,
    };
  };

  // the size control follows the side you are viewing (dragging a half flips to it)
  const side = snap.activeView;
  const k = KEYS[side];
  const sideActive = side === 'back' ? snap.isLogoBack : snap.isLogoTexture;
  const setScale = (d) => { state[k.scale] = Math.min(2, Math.max(0.5, +(snap[k.scale] + d).toFixed(2))); };
  const reset = () => { state[k.x] = 0; state[k.y] = 0; state[k.scale] = 1; };

  return (
    <div className="cz-padwrap">
      <p className="cz-adjust-title">Posición del diseño</p>
      <div
        ref={ref}
        className="cz-pad"
        onPointerDown={down}
        onPointerMove={(e) => { if (dragSide.current) place(e); }}
        onPointerUp={() => { dragSide.current = null; }}
        onPointerCancel={() => { dragSide.current = null; }}
      >
        <span className="cz-pad-divider" aria-hidden />
        <span className="cz-pad-cross-h" aria-hidden />
        <span className="cz-pad-tag" style={{ left: '25%' }}>Frente</span>
        <span className="cz-pad-tag" style={{ left: '75%' }}>Espalda</span>
        {snap.isLogoTexture
          ? <img src={snap.logoDecal} alt="" draggable={false} className="cz-pad-img" style={posFor('front')} />
          : <span className="cz-pad-empty" style={{ left: '25%' }}>Sin diseño</span>}
        {snap.isLogoBack
          ? <img src={snap.logoDecalBack} alt="" draggable={false} className="cz-pad-img" style={posFor('back')} />
          : <span className="cz-pad-empty" style={{ left: '75%' }}>Sin diseño</span>}
      </div>
      <div className="cz-pad-row">
        <span className="cz-pad-label">Tamaño · {side === 'back' ? 'Espalda' : 'Frente'}</span>
        {sideActive ? (
          <>
            <div className="cz-stepper">
              <button onClick={() => setScale(-0.1)} aria-label="Reducir">−</button>
              <span>{Math.round(snap[k.scale] * 100)}%</span>
              <button onClick={() => setScale(0.1)} aria-label="Aumentar">+</button>
            </div>
            <button className="cz-pad-reset" onClick={reset}>Restablecer</button>
          </>
        ) : (
          <span className="cz-pad-hintside">Sube un diseño para este lado</span>
        )}
      </div>
    </div>
  );
};

const Customizer = () => {
  const snap = useSnapshot(state);
  const [activeTool, setActiveTool] = useState('view'); // collapsed by default
  const [showHint, setShowHint] = useState(true);
  const expanded = activeTool !== 'view';

  // fixed fullscreen overlay -> lock document scroll, reset camera + facing
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    state.shirtRotY = 0;
    state.activeView = 'front';
    resetCam();
    return () => { document.body.style.overflow = prev; };
  }, []);

  // the rotate hint sits over the shirt and disappears on its own / on first touch
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 3500);
    return () => clearTimeout(t);
  }, []);

  // while a tool panel is open the camera lifts the shirt above the panel
  useEffect(() => {
    state.panelOpen = expanded;
    return () => { state.panelOpen = false; };
  }, [expanded]);

  const setView = turnTo;
  const handleAddToCart = () => {
    addToCart({ name: 'Diseño personalizado', price: 99900, color: snap.color, size: snap.size, qty: snap.quantity });
  };

  const uploadDesign = (side, e) => {
    const file = e.target.files[0];
    if (!file) return;
    reader(file).then((result) => {
      if (side === 'back') { state.logoDecalBack = result; state.isLogoBack = true; }
      else { state.logoDecal = result; state.isLogoTexture = true; }
      setView(side); // turn the shirt to the side you just designed
    });
    e.target.value = '';
  };
  const removeDesign = (side) => {
    if (side === 'back') state.isLogoBack = false;
    else state.isLogoTexture = false;
  };

  // plain upload buttons (the preview lives inside the position matrix)
  const UploadPill = ({ side, label, active }) => {
    const id = `cz-file-${side}`;
    return (
      <div className="cz-upill-wrap">
        <label htmlFor={id} className={`cz-upill ${active ? 'active' : ''}`}>
          {I.upload} {active ? `Cambiar ${label}` : `Subir ${label}`}
        </label>
        {active && (
          <button className="cz-upill-x" onClick={() => removeDesign(side)} aria-label={`Quitar ${label}`}>×</button>
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
    if (activeTool === 'size') {
      return (
        <>
          <p className="cz-menu-title">Talla</p>
          <div className="cz-sizes">
            {SIZES.map((s) => (
              <button
                key={s}
                className={`cz-size-pill ${snap.size === s ? 'active' : ''}`}
                onClick={() => (state.size = s)}
              >
                {s}
              </button>
            ))}
          </div>
        </>
      );
    }
    if (activeTool === 'design') {
      return (
        <>
          <p className="cz-menu-title">Diseño de la prenda</p>
          <div className="cz-upills">
            <UploadPill side="front" label="frente" active={snap.isLogoTexture} />
            <UploadPill side="back" label="espalda" active={snap.isLogoBack} />
          </div>
          {(snap.isLogoTexture || snap.isLogoBack) && <DesignPad />}
        </>
      );
    }
    return null;
  };

  return (
    <div className="customizer">
      {/* fullscreen 3D shirt in the background */}
      <div className="cz-canvas-full" onPointerDown={() => setShowHint(false)}><Canvas /></div>

      {/* top bar: back (left) + add to cart (right) */}
      <header className="cz-top">
        <button className="cz-back" onClick={() => (state.intro = true)}>{I.back} <span className="cz-back-t">Volver</span></button>
        <button className="cz-cart-top" onClick={handleAddToCart}>
          {I.bagPlus} <span className="cz-cart-top-t">Agregar al carrito</span>
        </button>
      </header>

      {/* rotate hint, centered over the shirt, fades out */}
      {showHint && <div className="cz-rotate-hint">{I.hand} Arrastra para rotar</div>}

      {/* bottom area: recenter (right) + front/back toggle + docked tool menu */}
      <div className="cz-bottom">
        <button className="cz-recenter" onClick={recenter} aria-label="Centrar" title="Centrar">{I.recenter}</button>

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
                <span className="cz-tab-label">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customizer;
