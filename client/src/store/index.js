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
  cartCount: 0,
});

export default state;
