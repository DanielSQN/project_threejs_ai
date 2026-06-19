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
});

export default state;