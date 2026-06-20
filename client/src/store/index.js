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
  activeView: 'front', // 'front' | 'back' -> rotates the shirt
  size: 'M',
  quantity: 1,
  cartCount: 0,
});

export default state;
