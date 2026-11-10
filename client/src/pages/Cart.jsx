import React, { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { FaWhatsapp } from 'react-icons/fa';

import state, { removeFromCart, setCartQty, formatPrice, cartTotal, checkout, dismissOrder } from '../store';
import { BRAND, whatsappLink } from '../config/brand';

// mensaje de pedido para WhatsApp con el detalle del carrito
const orderMessage = (items, total) => [
  `¡Hola ${BRAND.name}! Quiero hacer este pedido:`,
  '',
  ...items.map((i) => `• ${i.qty} × ${i.name} — talla ${i.size} — ${formatPrice(i.price * i.qty)}`),
  '',
  `Total: ${formatPrice(total)} (sin envío)`,
].join('\n');

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
  // abre WhatsApp con el pedido (dentro del click para que no lo bloquee el
  // navegador) y deja la pantalla de confirmación con un enlace de respaldo
  const sendOrder = () => {
    const link = whatsappLink(orderMessage(items, total));
    window.open(link, '_blank', 'noopener');
    checkout(link);
  };
  const design = () => { state.cartOpen = false; state.intro = false; };

  // order confirmation screen
  if (order) {
    return (
      <div className="cart">
        <header className="cart-top">
          <span className="cart-title">Pedido por WhatsApp</span>
        </header>
        <div className="cart-body">
          <div className="cart-done">
            <span className="cart-done-check">✓</span>
            <h2 className="cart-done-title">¡Pedido enviado!</h2>
            <p className="cart-done-text">
              Enviamos tu pedido de {order.count} {order.count === 1 ? 'prenda' : 'prendas'} por un total de{' '}
              <strong>{formatPrice(order.total)}</strong> a nuestro WhatsApp. Confírmalo en el chat y acordamos
              pago y envío.
            </p>
            {order.link && (
              <a className="cart-wa-again" href={order.link} target="_blank" rel="noopener noreferrer">
                ¿No se abrió WhatsApp? Toca aquí
              </a>
            )}
            <button className="btn-primary" onClick={dismissOrder}>Seguir explorando <span aria-hidden>→</span></button>
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
            <button className="btn-primary" onClick={design}>Diseñar una prenda <span aria-hidden>→</span></button>
          </div>
        ) : (
          <ul className="cart-list">
            {items.map((i) => (
              <li className="cart-item" key={i.id}>
                {i.image
                  ? <img className="cart-thumb" src={i.image} alt="" />
                  : <span className="cart-swatch" style={{ background: i.color }} />}
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
          <p className="cart-ship">Envío y pago se acuerdan por WhatsApp ({BRAND.whatsappDisplay}).</p>
          <button className="cart-checkout" onClick={sendOrder}>
            <FaWhatsapp size={18} /> Pedir por WhatsApp
          </button>
        </footer>
      )}
    </div>
  );
};

export default Cart;
