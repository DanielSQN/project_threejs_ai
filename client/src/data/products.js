// Shared product/catalog data used by both the home sections and the
// dedicated section pages, so they never drift apart.

export const STYLES = [
  { label: 'Clásico', color: '#D8CFBE', variant: 'classic' },
  { label: 'Oversize', color: '#1c1c1c', variant: 'oversize' },
  { label: 'Manga larga', color: '#2B3A55', variant: 'long' },
  { label: 'Hoodie', color: '#6E7B6B', variant: 'hoodie' },
];

// Precios base (COP). Ajusta aquí y se actualizan todas las tarjetas.
export const PRICES = { camiseta: 89900, camisetaPremium: 94900, hoodie: 149900 };

// Catálogo. `image` = foto real del producto (public/products); sin foto se
// dibuja la silueta con el color. `collection` enlaza con COLLECTIONS.
export const FEATURED = [
  // --- catálogo SAU (fotos reales)
  { name: 'God is more than able', verse: 'Camiseta oversize · blanca', price: PRICES.camiseta, color: '#F5F5F3', logo: './sau-mark.png', image: './products/god-is-more-than-able.jpg', collection: 'fe' },
  { name: 'Faith', verse: 'Camiseta oversize · lila', price: PRICES.camiseta, color: '#CFC8E6', logo: './sau-mark.png', image: './products/faith-modelo.jpg', collection: 'fe' },
  { name: 'Amarillo, azul y rojo', verse: 'Camiseta oversize · negra · espalda', price: PRICES.camisetaPremium, color: '#1c1c1c', logo: './sau-mark.png', image: './products/colombia-tricolor-modelo.jpg', collection: 'colombia' },
  { name: 'Soy Colombia como en el alma', verse: 'Hoodie · crema · espalda', price: PRICES.hoodie, color: '#EFE6D2', logo: './sau-mark.png', image: './products/soy-colombia-modelo.jpg', collection: 'colombia', variant: 'hoodie' },
  { name: 'Faith minimal', verse: 'Camiseta oversize · blanca', price: PRICES.camiseta, color: '#F5F5F3', logo: './sau-mark.png', image: './products/faith.jpg', collection: 'fe' },
  { name: 'Escudo Colombia', verse: 'Camiseta oversize · negra', price: PRICES.camiseta, color: '#1c1c1c', logo: './sau-mark.png', image: './products/colombia-escudo.jpg', collection: 'colombia' },
  { name: 'Colombia franja', verse: 'Hoodie · crema', price: PRICES.hoodie, color: '#EFE6D2', logo: './sau-mark.png', image: './products/colombia-franja.jpg', collection: 'colombia', variant: 'hoodie' },
  { name: 'Tierra de colores', verse: 'Hoodie · crema · espalda', price: PRICES.hoodie, color: '#EFE6D2', logo: './sau-mark.png', image: './products/soy-colombia.jpg', collection: 'colombia', variant: 'hoodie' },
  // --- versículos (personalizables en 3D)
  { name: 'Jesús es Rey', verse: 'Apocalipsis 19:16', price: PRICES.camiseta, color: '#1c1c1c', logo: './brand-logo.png', collection: 'fe' },
  { name: 'Todo lo puedo en Cristo', verse: 'Filipenses 4:13', price: PRICES.camiseta, color: '#D8CFBE', logo: './brand-logo.png', collection: 'proposito' },
  { name: 'Jehová es mi pastor', verse: 'Salmo 23:1', price: PRICES.camiseta, color: '#2B3A55', logo: './brand-logo.png', collection: 'esperanza' },
  { name: 'La Visión', verse: 'Habacuc 2:2', price: PRICES.camisetaPremium, color: '#A98B6A', logo: './brand-logo.png', collection: 'proposito' },
  { name: 'Gracia sobre gracia', verse: 'Juan 1:16', price: PRICES.camiseta, color: '#6E7B6B', logo: './brand-logo.png', collection: 'esperanza' },
  { name: 'Fe inquebrantable', verse: 'Hebreos 11:1', price: PRICES.camisetaPremium, color: '#2B3A55', logo: './brand-logo.png', collection: 'fe' },
  { name: 'Luz del mundo', verse: 'Mateo 5:14', price: PRICES.camiseta, color: '#F3F1EA', logo: './brand-logo.png', collection: 'esperanza' },
  { name: 'Esfuérzate y sé valiente', verse: 'Josué 1:9', price: PRICES.camisetaPremium, color: '#B7B7B2', logo: './brand-logo.png', collection: 'proposito' },
];

const countOf = (id) => {
  const n = FEATURED.filter((d) => d.collection === id).length;
  return `${n} ${n === 1 ? 'diseño' : 'diseños'}`;
};

export const COLLECTIONS = [
  { id: 'fe', name: 'Fe', count: countOf('fe'), color: '#efe7d8', desc: 'Declara aquello que sostiene tu caminar.', image: './products/god-is-more-than-able.jpg' },
  { id: 'colombia', name: 'Colombia', count: countOf('colombia'), color: '#f3e7c4', desc: 'Amarillo, azul y rojo: Colombia como en el alma.', image: './products/colombia-tricolor.jpg' },
  { id: 'esperanza', name: 'Esperanza', count: countOf('esperanza'), color: '#e4e7ec', desc: 'Mensajes que levantan la mirada.' },
  { id: 'proposito', name: 'Propósito', count: countOf('proposito'), color: '#e9e2ef', desc: 'Viste la visión que llevas dentro.' },
];
