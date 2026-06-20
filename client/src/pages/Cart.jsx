import React, { useEffect } from 'react';
import { useSnapshot } from 'valtio';

import state, { removeFromCart, setCartQty, formatPrice, cartTotal, checkout, dismissOrder } from '../store';

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
);

const Cart = () => {
  const snap = useSnapshot(state);
  const items = snap.cart;
  const total = cartTotal(items);
  const order = snap.order;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') { state.order ? dismissOrder() : (state.cartOpen = false); } };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, []);

  const close = () => { state.cartOpen = false; };
  const design = () => { state.cartOpen = false; state.intro = false; };

  // order confirmation screen
  if (order) {
    return (
      <div className="cart">
        <header className="cart-top">
          <span className="cart-title">Pedido confirmado</span>
        </header>
        <div className="cart-body">
          <div className="cart-done">
            <span className="cart-done-check">✓</span>
            <h2 className="cart-done-title">¡Gracias por tu compra!</h2>
            <p className="cart-done-text">
              Recibimos tu pedido de {order.count} {order.count === 1 ? 'prenda' : 'prendas'} por un total de{' '}
              <strong>{formatPrice(order.total)}</strong>. Te enviaremos los detalles a tu correo.
            </p>
            <button className="btn-beige" onClick={dismissOrder}>Seguir explorando <span aria-hidden>→</span></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <header className="cart-top">
        <button className="cz-back" onClick={close}><BackIcon /> <span>Seguir comprando</span></button>
        <span className="cart-title">Tu carrito{items.length > 0 ? ` · ${items.length}` : ''}</span>
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
                  <span className="cart-item-price">{formatPrice(i.price * i.qty)}</span>
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
          <p className="cart-ship">Envío calculado al finalizar.</p>
          <button className="cart-checkout" onClick={checkout}>Finalizar compra</button>
        </footer>
      )}
    </div>
  );
};

export default Cart;
