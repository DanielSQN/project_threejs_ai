import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state, { goPage } from '../store';
import Canvas from '../canvas';
import Navbar, { GenderSeg } from '../components/Navbar';
import Sections from '../components/Sections';

// Each design keeps the same base shirt but changes color + front print.
// Lead each catalog with a high-contrast design so the hero shirt reads clearly
// against the beige background (a beige shirt would blend in).
const CATALOG = {
  hombre: [
    { color: '#F5F5F3', logo: './sau-mark.png', name: 'SAU blanca' },
    { color: '#1c1c1c', logo: './sau-mark-white.png', name: 'SAU negra' },
    { color: '#EFE6D2', logo: './brand-logo.png', name: 'La Visión' },
    { color: '#7cc4bd', logo: './sau-mark.png', name: 'SAU verde' },
  ],
  mujer: [
    { color: '#CFC8E6', logo: './sau-mark.png', name: 'SAU lila' },
    { color: '#F5F5F3', logo: './brand-logo.png', name: 'La Visión' },
    { color: '#1c1c1c', logo: './sau-mark-white.png', name: 'SAU negra' },
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
      const delay = count < 4 ? 1300 : 4500; // brisk intro (a bit slower), then relaxed
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 900); // first change comes fairly quickly
    return () => clearTimeout(timer);
  }, [gender, designs.length]);

  return (
    <section className="home">
      <Navbar />

      <div className="hero-screen">
        <span className="hero-bgword" aria-hidden>SAU</span>

        <div className="hero">
          <div className="hero-copy">
            {/* on mobile the gender selector lives in the hero (navbar stays clean) */}
            <motion.div className="hero-gender lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <GenderSeg gender={gender} />
            </motion.div>
            <motion.p className="hero-eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              SAU · Camisetas personalizadas
            </motion.p>
            <motion.h1
              className="head-text"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Viste <br className="hidden lg:block" />tu <em>fe.</em>
            </motion.h1>
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: 'easeOut' }}
            >
              Diseños que hablan de lo que crees. Elige uno del catálogo o crea el tuyo en 3D.
            </motion.p>
          </div>

          <div className="hero-stage">
            <div className="hero-canvasbox">
              <Canvas />
            </div>
          </div>

          <motion.div className="hero-cta" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22 }}>
            <button className="btn-primary" onClick={() => (state.intro = false)}>
              Personalizar <span aria-hidden>→</span>
            </button>
            <button className="btn-ghost" onClick={() => goPage('disenos')}>Ver catálogo</button>
          </motion.div>
        </div>

        {/* mobile-only "scroll for more" hint */}
        <button
          className="hero-scroll-hint lg:hidden"
          onClick={() => document.getElementById('disenos')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Desliza para ver más"
        >
          <svg className="hero-scroll-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
      </div>

      <Sections />
    </section>
  );
};

export default Home;
