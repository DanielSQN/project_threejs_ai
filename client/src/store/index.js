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
  // customizer
  activeView: 'front', // 'front' | 'back' -> rotates the shirt
  size: 'M',
  quantity: 1,
  cartCount: 2,
});

export default state;
