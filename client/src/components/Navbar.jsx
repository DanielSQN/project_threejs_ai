import React from 'react';

const links = ['Hombre', 'Mujer', 'Diseños', 'Colecciones', 'Cómo funciona'];

const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

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

const Navbar = () => {
  return (
    <nav className="navbar">
      <img src="./brand-logo.png" alt="Viste tu fe" className="nav-logo-img" />

      <ul className="nav-links">
        {links.map((link, i) => (
          <li key={link} className={i === 0 ? 'active' : ''}>{link}</li>
        ))}
      </ul>

      <div className="nav-icons">
        <button aria-label="Buscar" className="nav-icon-btn lg:inline-flex hidden"><IconSearch /></button>
        <button aria-label="Cuenta" className="nav-icon-btn lg:inline-flex hidden"><IconUser /></button>
        <button aria-label="Menú" className="nav-icon-btn lg:hidden inline-flex"><IconMenu /></button>
        <button aria-label="Carrito" className="nav-icon-btn nav-cart inline-flex">
          <IconBag />
          <span className="cart-badge">2</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
