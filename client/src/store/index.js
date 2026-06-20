import { proxy } from 'valtio';

const state = proxy({
  intro: true,
  color: '#D8CFBE',
  isLogoTexture: true,
  isFullTexture: false,
  isLogoBack: false,
  logoDecal: './brand-logo.png',
  fullDecal: './threejs.png',
  logoDecalBack: './brand-logo.png',
  // home hero
  breezeTick: 0, // bump to trigger a wind "gust" on the shirt
  // customizer
  activeView: 'front', // 'front' | 'back' -> derived from / drives shirtRotY
  shirtRotY: 0, // target Y rotation of the shirt (radians), shared by drag + toggle
  size: 'M',
  quantity: 1,
  // cart
  cart: [], // { id, key, name, price, color, size, qty }
  cartOpen: false,
});

export const cartCount = (cart = state.cart) => cart.reduce((sum, i) => sum + i.qty, 0);

export const formatPrice = (n) => '$' + Number(n).toLocaleString('es-CO');

export const addToCart = (item) => {
  const qty = item.qty || 1;
  const key = `${item.name}|${item.color}|${item.size}`;
  const existing = state.cart.find((i) => i.key === key);
  if (existing) {
    existing.qty += qty;
  } else {
    state.cart.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      key,
      name: item.name,
      price: item.price,
      color: item.color,
      size: item.size || 'M',
      qty,
    });
  }
};

export const removeFromCart = (id) => {
  state.cart = state.cart.filter((i) => i.id !== id);
};

export const setCartQty = (id, qty) => {
  const item = state.cart.find((i) => i.id === id);
  if (item) item.qty = Math.max(1, qty);
};

export default state;
