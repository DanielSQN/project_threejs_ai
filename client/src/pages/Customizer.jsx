import React, { useState } from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';
import Canvas from '../canvas';
import { reader } from '../config/helpers';

/* ---------- icons ---------- */
const I = {
  back: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>,
  save: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>,
  undo: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 14 4 9 9 4" /><path d="M20 20v-7a4 4 0 0 0-4-4H4" /></svg>,
  redo: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 14 20 9 15 4" /><path d="M4 20v-7a4 4 0 0 1 4-4h12" /></svg>,
  bag: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>,
  color: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996C19.518 16.396 22 13.914 22 11c0-4.969-4.5-9-10-9z" /></svg>,
  design: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>,
  text: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg>,
  verse: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2h-4v6H4v4h6v10h4V12h6V8h-6z" /></svg>,
  view: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>,
  ai: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></svg>,
  tshirt: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3 4 6 2 9l3 2 1-1v11h12V10l1 1 3-2-2-3-4-3a4 4 0 0 1-8 0Z" /></svg>,
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
  { id: 'color', label: 'Color', desc: 'Cambia el color de la prenda', icon: I.color },
  { id: 'design', label: 'Diseño', desc: 'Elige o crea tu estampado', icon: I.design },
  { id: 'text', label: 'Texto', desc: 'Agrega texto o versículo', icon: I.text },
  { id: 'verse', label: 'Versículo', desc: 'Añade versículos bíblicos', icon: I.verse },
  { id: 'view', label: 'Vista', desc: 'Frente, espalda y mangas', icon: I.view },
  { id: 'ai', label: 'IA', desc: 'Genera diseños con IA', icon: I.ai },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const Customizer = () => {
  const snap = useSnapshot(state);
  const [activeTool, setActiveTool] = useState('color');

  const setView = (v) => { state.activeView = v; };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    reader(file).then((result) => {
      if (state.activeView === 'back') { state.logoDecalBack = result; state.isLogoBack = true; }
      else { state.logoDecal = result; state.isLogoTexture = true; }
    });
  };

  const currentColor = COLORS.find((c) => c.hex.toLowerCase() === snap.color.toLowerCase());
  const colorName = currentColor ? currentColor.name : 'Personalizado';

  const ColorSwatches = () => (
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
  );

  const ToolPanelContent = () => {
    if (activeTool === 'design') {
      return (
        <div className="cz-tool-body">
          <label htmlFor="cz-file" className="cz-upload">Subir imagen</label>
          <input id="cz-file" type="file" accept="image/*" onChange={handleUpload} hidden />
          <p className="cz-note">Se aplica en la vista {snap.activeView === 'back' ? 'trasera' : 'frontal'}.</p>
        </div>
      );
    }
    if (activeTool === 'view') {
      return (
        <div className="cz-tool-body">
          <div className="cz-viewtoggle w-full">
            <button className={snap.activeView === 'front' ? 'active' : ''} onClick={() => setView('front')}>Frente</button>
            <button className={snap.activeView === 'back' ? 'active' : ''} onClick={() => setView('back')}>Espalda</button>
          </div>
        </div>
      );
    }
    if (activeTool === 'text' || activeTool === 'verse' || activeTool === 'ai') {
      return <p className="cz-note cz-tool-body">Próximamente.</p>;
    }
    // default: color
    return (
      <div className="cz-tool-body">
        <p className="cz-label">Color de la prenda</p>
        <ColorSwatches />
      </div>
    );
  };

  return (
    <div className="customizer">
      {/* ===== Desktop top nav ===== */}
      <header className="cz-nav">
        <img src="./brand-logo.png" alt="Viste tu fe" className="nav-logo-img" />
        <ul className="nav-links">
          <li className="active">Diseño</li>
          <li>Productos</li>
          <li>Colecciones</li>
          <li>Inspiración</li>
          <li>Cómo funciona</li>
        </ul>
        <div className="cz-nav-actions">
          <button className="cz-icon-btn" aria-label="Deshacer">{I.undo}</button>
          <button className="cz-icon-btn" aria-label="Rehacer">{I.redo}</button>
          <button className="cz-save">{I.save} Guardar diseño</button>
          <button className="cz-icon-btn nav-cart" aria-label="Carrito">{I.bag}<span className="cart-badge">{snap.cartCount}</span></button>
        </div>
      </header>

      {/* ===== Mobile top bar ===== */}
      <header className="cz-topbar lg:hidden">
        <button className="cz-back" onClick={() => (state.intro = true)}>{I.back} Volver</button>
        <button className="cz-save-m">Guardar {I.save}</button>
      </header>

      <div className="cz-body">
        {/* ===== Left tools (desktop) ===== */}
        <aside className="cz-left">
          <p className="cz-panel-title">Personaliza tu diseño</p>
          <div className="cz-tools">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                className={`cz-tool ${activeTool === t.id ? 'active' : ''}`}
                onClick={() => setActiveTool(t.id)}
              >
                <span className="cz-tool-icon">{t.icon}</span>
                <span className="cz-tool-text">
                  <span className="cz-tool-label">{t.label}</span>
                  <span className="cz-tool-desc">{t.desc}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="cz-help">
            <p className="cz-help-title">¿Necesitas ayuda?</p>
            <p className="cz-help-desc">Te ayudamos a crear tu diseño perfecto.</p>
            <button className="cz-help-btn">Contactar soporte</button>
          </div>
        </aside>

        {/* ===== Center stage ===== */}
        <section className="cz-stage">
          <div className="cz-canvas"><Canvas /></div>
          <div className="cz-dots">
            {[0, 1, 2, 3, 4].map((d) => (
              <span key={d} className={`dot ${d === 0 ? 'active' : ''}`} />
            ))}
          </div>
          <p className="cz-hint">Desliza para cambiar de diseño</p>
          <div className="cz-viewtoggle">
            <button className={snap.activeView === 'front' ? 'active' : ''} onClick={() => setView('front')}>Frente</button>
            <button className={snap.activeView === 'back' ? 'active' : ''} onClick={() => setView('back')}>Espalda</button>
          </div>
          <p className="cz-hint cz-hint-rotate">↻ Arrastra para rotar la prenda</p>
        </section>

        {/* ===== Right details (desktop) ===== */}
        <aside className="cz-right">
          <p className="cz-panel-title">Detalles del diseño</p>

          <div className="cz-card cz-card-row">
            <div className="cz-card-left">
              <span className="cz-color-dot" style={{ background: snap.color }} />
              <span>
                <span className="cz-card-title">Color de la prenda</span>
                <span className="cz-card-sub">{colorName} · {snap.color.toUpperCase()}</span>
              </span>
            </div>
          </div>

          <div className="cz-card cz-card-row">
            <div className="cz-card-left">
              <img src={snap.activeView === 'back' ? snap.logoDecalBack : snap.logoDecal} alt="" className="cz-design-thumb" />
              <span>
                <span className="cz-card-title">La Visión</span>
                <span className="cz-card-sub">{snap.activeView === 'back' ? 'Espalda' : 'Frente'}</span>
              </span>
            </div>
          </div>

          <label htmlFor="cz-file-r" className="cz-edit-btn">Editar diseño</label>
          <input id="cz-file-r" type="file" accept="image/*" onChange={handleUpload} hidden />

          <p className="cz-label">Ubicación del diseño</p>
          <div className="cz-location">
            <button className={`cz-loc ${snap.activeView === 'front' ? 'active' : ''}`} onClick={() => setView('front')}>{I.tshirt}</button>
            <button className={`cz-loc ${snap.activeView === 'back' ? 'active' : ''}`} onClick={() => setView('back')}>{I.tshirt}</button>
          </div>

          <p className="cz-label">Talla</p>
          <select className="cz-select" value={snap.size} onChange={(e) => (state.size = e.target.value)}>
            {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <p className="cz-label">Cantidad</p>
          <div className="cz-qty">
            <button onClick={() => (state.quantity = Math.max(1, snap.quantity - 1))}>−</button>
            <span>{snap.quantity}</span>
            <button onClick={() => (state.quantity = snap.quantity + 1)}>+</button>
          </div>

          <button className="cz-addcart" onClick={() => (state.cartCount = snap.cartCount + snap.quantity)}>
            {I.bag} Agregar al carrito
          </button>
        </aside>
      </div>

      {/* ===== Mobile bottom sheet ===== */}
      <div className="cz-sheet lg:hidden">
        <div className="cz-sheet-grip" />
        <div className="cz-tabs">
          {TOOLS.slice(0, 5).map((t) => (
            <button
              key={t.id}
              className={`cz-tab ${activeTool === t.id ? 'active' : ''}`}
              onClick={() => setActiveTool(t.id)}
            >
              <span className="cz-tab-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
        <ToolPanelContent />
        <button
          className="cz-addcart"
          onClick={() => { if (activeTool !== 'color') state.cartCount = snap.cartCount + snap.quantity; }}
        >
          {activeTool === 'color' ? 'Aplicar color' : 'Agregar al carrito'}
        </button>
        <p className="cz-realtime">✦ Los cambios se aplican en tiempo real</p>
      </div>
    </div>
  )
}

export default Customizer
