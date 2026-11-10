import React, { useEffect, useState } from 'react';
import { FaWhatsapp, FaInstagram, FaTiktok } from 'react-icons/fa';

import { BRAND, whatsappLink } from '../config/brand';

const LINKS = [
  { label: 'WhatsApp', href: whatsappLink('¡Hola SAU! Quiero información sobre sus camisetas.'), Icon: FaWhatsapp },
  { label: 'Instagram', href: BRAND.instagram, Icon: FaInstagram },
  { label: 'TikTok', href: BRAND.tiktok, Icon: FaTiktok },
];

// fila de iconos de redes (footer, menú móvil)
export const SocialLinks = ({ size = 18, className = '' }) => (
  <div className={`social-links ${className}`}>
    {LINKS.map(({ label, href, Icon }) => (
      <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
        <Icon size={size} />
      </a>
    ))}
  </div>
);

// Botón flotante de WhatsApp. Con `afterScroll` (portada) aparece solo al
// bajar, para no tapar los botones del hero.
export const WhatsAppFab = ({ afterScroll = false }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!afterScroll) return undefined;
    const onScroll = () => setScrolled(window.scrollY > 200);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [afterScroll]);

  if (afterScroll && !scrolled) return null;
  return (
    <a
      className="wa-fab"
      href={whatsappLink('¡Hola SAU! Quiero información sobre sus camisetas.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Escríbenos por WhatsApp al ${BRAND.whatsappDisplay}`}
      title="Escríbenos por WhatsApp"
    >
      <FaWhatsapp size={28} />
    </a>
  );
};

export const SiteFooter = () => (
  <footer className="site-footer">
    <img src={BRAND.logoWhite} alt={BRAND.name} className="footer-logo" />
    <span className="footer-brand">S A U</span>
    <span className="footer-tag">{BRAND.tagline}</span>
    <SocialLinks size={20} className="footer-social" />
    <a className="footer-contact" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
      WhatsApp {BRAND.whatsappDisplay}
    </a>
    <span className="footer-handle">{BRAND.handle}</span>
    <span className="footer-copy">© {new Date().getFullYear()} {BRAND.fullName}</span>
  </footer>
);
