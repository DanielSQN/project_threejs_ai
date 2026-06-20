import React, { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { IoIosMan, IoIosWoman } from 'react-icons/io';

import state, { cartCount, goPage, goHomeSection } from '../store';

const links = [
  { label: 'Diseños', page: 'disenos' },
  { label: 'Colecciones', page: 'colecciones' },
  { label: 'Cómo funciona', section: 'beneficios' },
];

const navigate = (link) => {
  if (link.page) goPage(link.page);
  else if (link.section) goHomeSection(link.section);
};

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

// Shared gender segmented control (lives in the navbar + the mobile menu).
const GenderSeg = ({ gender, size = 20, className = '' }) => (
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

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const onLink = (link) => { navigate(link); setMenuOpen(false); };

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <img src="./brand-icon.png" alt="Viste tu fe" className="nav-logo-img" onClick={() => goPage('home')} />
          <ul className="nav-links">
            {links.map((link) => (
              <li key={link.label} className={link.page && snap.page === link.page ? 'active' : ''} onClick={() => navigate(link)}>{link.label}</li>
            ))}
          </ul>
        </div>

        {/* gender selector lives in the navbar, centered */}
        <GenderSeg gender={snap.gender} className="nav-gender" />

        <div className="nav-right">
          <button aria-label="Ver carrito" className="nav-icon-btn nav-cart" onClick={() => (state.cartOpen = true)}>
            <IconBag />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
          {/* menu is the right-most control */}
          <button aria-label="Menú" className="nav-icon-btn lg:hidden inline-flex" onClick={() => setMenuOpen(true)}><IconMenu /></button>
        </div>
      </nav>

      {/* drawer is a sibling of the nav so the navbar's backdrop-filter does not
          become its containing block (which made it render transparent) */}
      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mm-head">
              <img src="./brand-icon.png" alt="Viste tu fe" className="h-9 w-auto object-contain" />
              <button className="mm-close" onClick={() => setMenuOpen(false)} aria-label="Cerrar">✕</button>
            </div>

            {/* gender selector at the top of the menu */}
            <GenderSeg gender={snap.gender} size={22} className="mm-gender" />

            <ul className="mm-links">
              {links.map((link) => (
                <li key={link.label} onClick={() => onLink(link)}>{link.label}</li>
              ))}
              <li onClick={() => { state.cartOpen = true; setMenuOpen(false); }}>
                Ver carrito{count > 0 ? ` (${count})` : ''}
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
