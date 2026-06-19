import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import state from '../store';
import Canvas from '../canvas';
import Navbar from '../components/Navbar';
import { headContentAnimation, headTextAnimation } from '../config/motion';

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Chevron = ({ dir }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {dir === 'left' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
  </svg>
);

// Each design keeps the same base shirt but changes color + front print + verse.
const CATALOG = {
  hombre: [
    { color: '#D8CFBE', logo: './brand-logo.png', name: 'La Visión' },
    { color: '#2B3A55', logo: './threejs.png', name: 'Fe Inquebrantable' },
    { color: '#1c1c1c', logo: './react.png', name: 'Provisión' },
    { color: '#6E7B6B', logo: './brand-logo.png', name: 'Esperanza' },
  ],
  mujer: [
    { color: '#F3F1EA', logo: './brand-logo.png', name: 'Gracia' },
    { color: '#A98B6A', logo: './threejs.png', name: 'Luz del Mundo' },
    { color: '#B7B7B2', logo: './react.png', name: 'Fe' },
  ],
};

const Home = () => {
  const [gender, setGender] = useState('hombre');
  const [idx, setIdx] = useState(0);
  const touchX = useRef(null);
  const designs = CATALOG[gender];

  // apply the current design to the shared 3D state + trigger a wind gust
  useEffect(() => {
    const d = CATALOG[gender][idx];
    state.color = d.color;
    state.logoDecal = d.logo;
    state.isLogoTexture = true;
    state.breezeTick += 1;
  }, [gender, idx]);

  // auto-advance every ~4.5s; restarts whenever the design changes (manual
  // swipe / arrow / dot included), so a manual change resets the timer.
  useEffect(() => {
    const id = setInterval(() => setIdx((p) => (p + 1) % designs.length), 4500);
    return () => clearInterval(id);
  }, [gender, idx, designs.length]);

  const go = (dir) => setIdx((p) => (p + dir + designs.length) % designs.length);
  const selectGender = (g) => { setGender(g); setIdx(0); };

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <section className="home">
      <Navbar />

      <div className="hero">
        <div className="gender-seg">
          <button
            className={`seg ${gender === 'hombre' ? 'active' : ''}`}
            onClick={() => selectGender('hombre')}
          >
            <UserIcon /> Hombre
          </button>
          <button
            className={`seg ${gender === 'mujer' ? 'active' : ''}`}
            onClick={() => selectGender('mujer')}
          >
            <UserIcon /> Mujer
          </button>
        </div>

        <motion.h1 className="head-text" {...headTextAnimation}>
          VISTE TU FE.
        </motion.h1>
        <motion.p className="hero-subtitle" {...headContentAnimation}>
          Diseños que hablan de lo que crees.
        </motion.p>

        <div className="hero-stage">
          <button className="hero-arrow left" onClick={() => go(-1)} aria-label="Anterior"><Chevron dir="left" /></button>
          <div
            className="hero-canvasbox"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Canvas />
          </div>
          <button className="hero-arrow right" onClick={() => go(1)} aria-label="Siguiente"><Chevron dir="right" /></button>
        </div>

        <div className="hero-dots">
          {designs.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === idx ? 'active' : ''}`}
              onClick={() => setIdx(i)}
              aria-label={`Diseño ${i + 1}`}
            />
          ))}
        </div>

        <p className="hero-desc">
          Personaliza colores, estampados y versículos en tiempo real.
        </p>

        <button className="btn-beige" onClick={() => (state.intro = false)}>
          Personalizar ahora <span aria-hidden>→</span>
        </button>
      </div>
    </section>
  )
}

export default Home
