import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state from '../store';
import Canvas from '../canvas';
import Navbar from '../components/Navbar';
import Sections from '../components/Sections';

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
  const designs = CATALOG[gender];

  // a gender change (from the navbar) restarts the catalog
  useEffect(() => { setIdx(0); }, [gender]);

  // apply the current design to the shared 3D state + trigger a wind gust
  useEffect(() => {
    const d = CATALOG[gender][idx % CATALOG[gender].length];
    state.color = d.color;
    state.logoDecal = d.logo;
    state.isLogoTexture = true;
    state.breezeTick += 1;
  }, [gender, idx]);

  // the style/colour changes on its own (no manual controls). It starts with a
  // quick burst through a few styles so the visitor immediately sees it cycling,
  // then settles into a relaxed pace. The shirt also auto-rotates and can be
  // dragged by hand (handled in the canvas).
  useEffect(() => {
    let count = 0;
    let timer;
    const tick = () => {
      setIdx((p) => (p + 1) % designs.length);
      count += 1;
      const delay = count < 4 ? 800 : 4500; // fast intro, then relaxed
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 600); // first change comes quickly
    return () => clearTimeout(timer);
  }, [gender, designs.length]);

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
            <div className="hero-canvasbox">
              <Canvas />
            </div>
          </div>

          <button className="btn-beige" onClick={() => (state.intro = false)}>
            Personalizar ahora <span aria-hidden>→</span>
          </button>
        </div>

        {/* mobile-only "scroll for more" hint */}
        <button
          className="hero-scroll-hint lg:hidden"
          onClick={() => document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Desliza para ver más"
        >
          <span>Desliza para ver más</span>
          <svg className="hero-scroll-chevron" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
      </div>

      <Sections />
    </section>
  );
};

export default Home;
