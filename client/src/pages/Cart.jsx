import React, { useEffect } from 'react';
import { useSnapshot } from 'valtio';

import state, { removeFromCart, setCartQty, formatPrice } from '../store';

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
);

const Cart = () => {
  const snap = useSnapshot(state);
  const items = snap.cart;
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const close = () => { state.cartOpen = false; };
  const design = () => { state.cartOpen = false; state.intro = false; };

  return (
    <div className="cart">
      <header className="cart-top">
        <button className="cz-back" onClick={close}><BackIcon /> <span>Seguir comprando</span></button>
        <span className="cart-title">Tu carrito</span>
      </header>

      <div className="cart-body">
        {items.length === 0 ? (
          <div className="cart-empty">
            <p className="cart-empty-text">Tu carrito está vacío.</p>
            <button className="btn-beige" onClick={design}>Diseñar una prenda <span aria-hidden>→</span></button>
          </div>
        ) : (
          <ul className="cart-list">
            {items.map((i) => (
              <li className="cart-item" key={i.id}>
                <span className="cart-swatch" style={{ background: i.color }} />
                <div className="cart-item-info">
                  <span className="cart-item-name">{i.name}</span>
                  <span className="cart-item-meta">Talla {i.size}</span>
                  <span className="cart-item-price">{formatPrice(i.price)}</span>
                </div>
                <div className="cart-item-actions">
                  <div className="cart-qty">
                    <button onClick={() => setCartQty(i.id, i.qty - 1)} aria-label="Menos">−</button>
                    <span>{i.qty}</span>
                    <button onClick={() => setCartQty(i.id, i.qty + 1)} aria-label="Más">+</button>
                  </div>
                  <button className="cart-remove" onClick={() => removeFromCart(i.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <footer className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button className="cart-checkout">Finalizar compra</button>
        </footer>
      )}
    </div>
  );
};

export default Cart;
