// Datos de marca SAU (SAUrban.co). Cambia aquí el contacto o las redes y se
// actualiza en todo el sitio (navbar, menú, footer, botón y pedidos de WhatsApp).
export const BRAND = {
  name: 'SAU',
  fullName: 'SAU Urban',
  tagline: 'Camisetas personalizadas',
  handle: '@SAUrban.co',
  logo: './sau-logo.png', // monograma oscuro (sobre fondos claros)
  logoWhite: './sau-logo-white.png', // monograma blanco (sobre fondos oscuros)
  whatsappDisplay: '321 288 1896',
  whatsapp: '573212881896', // +57 (Colombia) + número, sin espacios
  instagram: 'https://www.instagram.com/saurban.co',
  tiktok: 'https://www.tiktok.com/@saurban.co',
};

// enlace wa.me con un mensaje ya escrito
export const whatsappLink = (message = '') =>
  `https://wa.me/${BRAND.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
