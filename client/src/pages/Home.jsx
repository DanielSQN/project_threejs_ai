import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state from '../store';
import Canvas from '../canvas';
import Navbar from '../components/Navbar';
import Sections from '../components/Sections';

const Chevron = ({ dir }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {dir === 'left' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
  </svg>
);

// Each design keeps the same base shirt but changes color + front print.
// Lead each catalog with a high-contrast design so the hero shirt reads clearly
// against the beige background (a beige shirt would blend in).
const CATALOG = {
  hombre: [
    { color: '#1c1c1c', logo: './brand-logo.png', name: 'La Visión' },
    { color: '#2B3A55', logo: './threejs.png', name: 'Fe Inquebrantable' },
    { color: '#6E7B6B', logo: './react.png', name: 'Provisión' },
    { color: '#D8CFBE', logo: './brand-logo.png', name: 'Esperanza' },
  ],
  mujer: [
    { color: '#2B3A55', logo: './brand-logo.png', name: 'Gracia' },
    { color: '#A98B6A', logo: './threejs.png', name: 'Luz del Mundo' },
    { color: '#F3F1EA', logo: './react.png', name: 'Fe' },
  ],
};

const Home = () => {
  const snap = useSnapshot(state);
  const gender = snap.gender; // shared with the navbar so its selector switches the catalog
  const [idx, setIdx] = useState(0);
  const touchX = useRef(null);
  const designs = CATALOG[gender];

  // a gender change (from the navbar) restarts the carousel
  useEffect(() => { setIdx(0); }, [gender]);

  // apply the current design to the shared 3D state + trigger a wind gust
  useEffect(() => {
    const d = CATALOG[gender][idx % CATALOG[gender].length];
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

      <div className="hero-screen">
        <div className="hero">
          <motion.h1
            className="head-text"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            VISTE TU FE.
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06, ease: 'easeOut' }}
          >
            Diseños que hablan de lo que crees.
          </motion.p>

          <div className="hero-stage">
            <button className="hero-arrow left" onClick={() => go(-1)} aria-label="Anterior"><Chevron dir="left" /></button>
            <div className="hero-canvasbox" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
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

          <button className="btn-beige" onClick={() => (state.intro = false)}>
            Personalizar ahora <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <Sections />
    </section>
  );
};

export default Home;
