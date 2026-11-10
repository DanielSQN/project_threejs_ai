import React, { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { IoIosMan, IoIosWoman } from 'react-icons/io';

import state, { cartCount, goPage } from '../store';
import { BRAND } from '../config/brand';
import { SocialLinks } from './Social';

const links = [
  { label: 'Diseños', page: 'disenos' },
  { label: 'Colecciones', page: 'colecciones' },
];

const IconBag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

// Shared gender segmented control (hero on mobile, navbar on desktop, menu).
export const GenderSeg = ({ gender, size = 20, className = '' }) => (
  <div className={`gender-seg ${className}`}>
    <button className={`seg ${gender === 'hombre' ? 'active' : ''}`} onClick={() => (state.gender = 'hombre')} aria-label="Hombre" title="Hombre">
      <IoIosMan size={size} />
    </button>
    <button className={`seg ${gender === 'mujer' ? 'active' : ''}`} onClick={() => (state.gender = 'mujer')} aria-label="Mujer" title="Mujer">
      <IoIosWoman size={size} />
    </button>
  </div>
);

const Navbar = () => {
  const snap = useSnapshot(state);
  const count = cartCount(snap.cart);
  const [menuOpen, setMenuOpen] = useState(false);

  // the menu is a fullscreen layer: lock the page scroll behind it (iOS kept
  // showing/scrolling the content underneath) and close with Esc
  useEffect(() => {
    if (!menuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [menuOpen]);

  const go = (page) => { goPage(page); setMenuOpen(false); };

  return (
    <>
      <nav className="navbar">
        {/* left: menu (mobile) / logo + links (desktop) */}
        <div className="nav-side">
          <button aria-label="Menú" className="nav-icon-btn lg:hidden" onClick={() => setMenuOpen(true)}><IconMenu /></button>
          <img src={BRAND.logoWhite} alt={BRAND.name} className="nav-logo-img hidden lg:block" onClick={() => goPage('home')} />
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.label} className={snap.page === l.page ? 'active' : ''} onClick={() => goPage(l.page)}>{l.label}</li>
            ))}
          </ul>
        </div>

        {/* mobile: brand centered */}
        <img src={BRAND.logoWhite} alt={BRAND.name} className="nav-logo-img nav-logo-center lg:hidden" onClick={() => goPage('home')} />

        {/* desktop: gender centered */}
        <div className="nav-gender hidden lg:block"><GenderSeg gender={snap.gender} /></div>

        {/* right: cart */}
        <div className="nav-side nav-side-r">
          <button aria-label="Ver carrito" className="nav-icon-btn nav-cart" onClick={() => (state.cartOpen = true)}>
            <IconBag />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
        </div>
      </nav>

      {/* fullscreen mobile menu — its own opaque layer, nothing shows behind */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mm-head">
            <img src={BRAND.logoWhite} alt={BRAND.name} className="h-9 w-auto object-contain" />
            <button className="mm-close" onClick={() => setMenuOpen(false)} aria-label="Cerrar">✕</button>
          </div>

          <GenderSeg gender={snap.gender} size={22} className="mm-gender" />

          <ul className="mm-links">
            <li onClick={() => go('home')}><span>01</span> Inicio</li>
            <li onClick={() => go('disenos')}><span>02</span> Diseños</li>
            <li onClick={() => go('colecciones')}><span>03</span> Colecciones</li>
          </ul>

          <div className="mm-contact">
            <SocialLinks size={22} />
            <span>{BRAND.handle} · WhatsApp {BRAND.whatsappDisplay}</span>
          </div>

          <button className="mm-cart" onClick={() => { state.cartOpen = true; setMenuOpen(false); }}>
            <IconBag /> Ver carrito{count > 0 ? ` (${count})` : ''}
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
