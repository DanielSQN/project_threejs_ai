import { proxy } from 'valtio';

const state = proxy({
  intro: true,
  color: '#D8CFBE',
  isLogoTexture: true,
  isFullTexture: false,
  isLogoBack: false,
  logoDecal: './threejs.png',
  fullDecal: './threejs.png',
  logoDecalBack: './threejs.png',
});

export default state;