import React from 'react';

import state, { addToCart, formatPrice } from '../store';
import Tee from './Tee';

const BagPlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="12" y1="10" x2="12" y2="16" /><line x1="9" y1="13" x2="15" y2="13" />
  </svg>
);

// Abre el editor 3D con el color/estampado del diseño. No toca state.page, así
// "Volver" regresa a la página desde la que se abrió.
export const openEditor = (d = {}) => {
  if (d.color) state.color = d.color;
  if (d.logo) { state.logoDecal = d.logo; state.isLogoTexture = true; }
  state.activeView = 'front';
  state.intro = false;
};

// Tarjeta de producto compartida (home + página de Diseños): foto real si la
// hay, si no la silueta de la prenda en su color.
const DesignCard = ({ d }) => (
  <div className="design-card">
    <div className={`design-tee ${d.image ? 'has-photo' : ''}`} onClick={() => openEditor(d)}>
      {d.image
        ? <img src={d.image} alt={d.name} loading="lazy" className="design-photo" />
        : <Tee color={d.color} variant={d.variant} />}
    </div>
    <div className="design-info">
      <span className="design-name">{d.name}</span>
      <span className="design-verse">{d.verse}</span>
      <span className="design-price">{formatPrice(d.price)}</span>
      <div className="design-actions">
        <button className="design-personalize" onClick={() => openEditor(d)}>Personalizar</button>
        <button
          className="design-add"
          onClick={(e) => { e.stopPropagation(); addToCart({ name: d.name, price: d.price, color: d.color, image: d.image, size: 'M', qty: 1 }); }}
          aria-label="Agregar al carrito"
        >
          <BagPlusIcon />
        </button>
      </div>
    </div>
  </div>
);

export default DesignCard;
