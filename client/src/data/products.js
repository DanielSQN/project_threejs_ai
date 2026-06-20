// Shared product/catalog data used by both the home sections and the
// dedicated section pages, so they never drift apart.

export const STYLES = [
  { label: 'Clásico', color: '#D8CFBE', variant: 'classic' },
  { label: 'Oversize', color: '#1c1c1c', variant: 'oversize' },
  { label: 'Manga larga', color: '#2B3A55', variant: 'long' },
  { label: 'Hoodie', color: '#6E7B6B', variant: 'hoodie' },
];

export const FEATURED = [
  { name: 'Jesús es Rey', verse: 'Apocalipsis 19:16', price: 89900, color: '#1c1c1c', logo: './brand-logo.png' },
  { name: 'Todo lo puedo en Cristo', verse: 'Filipenses 4:13', price: 89900, color: '#D8CFBE', logo: './brand-logo.png' },
  { name: 'Jehová es mi pastor', verse: 'Salmo 23:1', price: 89900, color: '#2B3A55', logo: './brand-logo.png' },
  { name: 'La Visión', verse: 'Habacuc 2:2', price: 94900, color: '#A98B6A', logo: './brand-logo.png' },
  { name: 'Gracia sobre gracia', verse: 'Juan 1:16', price: 89900, color: '#6E7B6B', logo: './brand-logo.png' },
  { name: 'Fe inquebrantable', verse: 'Hebreos 11:1', price: 94900, color: '#2B3A55', logo: './brand-logo.png' },
  { name: 'Luz del mundo', verse: 'Mateo 5:14', price: 89900, color: '#F3F1EA', logo: './brand-logo.png' },
  { name: 'Esfuérzate y sé valiente', verse: 'Josué 1:9', price: 94900, color: '#B7B7B2', logo: './brand-logo.png' },
];

export const COLLECTIONS = [
  { id: 'fe', name: 'Fe', count: '12 diseños', color: '#efe7d8', desc: 'Declara aquello que sostiene tu caminar.' },
  { id: 'esperanza', name: 'Esperanza', count: '8 diseños', color: '#e4e7ec', desc: 'Mensajes que levantan la mirada.' },
  { id: 'proposito', name: 'Propósito', count: '10 diseños', color: '#e9e2ef', desc: 'Viste la visión que llevas dentro.' },
];
