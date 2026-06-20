import React, { useEffect } from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';

const Toast = () => {
  const snap = useSnapshot(state);

  useEffect(() => {
    if (!snap.toast) return undefined;
    const id = setTimeout(() => { state.toast = null; }, 4500);
    return () => clearTimeout(id);
  }, [snap.toast]);

  if (!snap.toast || snap.cartOpen) return null;

  return (
    <div className="toast">
      <div className="toast-card">
        <span className="toast-check">✓</span>
        <div className="toast-text">
          <span className="toast-title">Se agregó al carrito</span>
          <span className="toast-name">{snap.toast}</span>
        </div>
        <button className="toast-link" onClick={() => { state.toast = null; state.cartOpen = true; }}>
          Ver carrito
        </button>
        <button className="toast-close" onClick={() => (state.toast = null)} aria-label="Cerrar">✕</button>
      </div>
    </div>
  );
};

export default Toast;
