import { useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

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

const CubeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const CrossIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2h-4v6H4v4h6v10h4V12h6V8h-6z" />
  </svg>
);

const features = [
  { icon: <CubeIcon />, label: 'VISTA 3D\nINTERACTIVA' },
  { icon: <CrossIcon />, label: 'DISEÑOS\nCRISTIANOS' },
  { icon: <CrossIcon />, label: 'PERSONALIZACIÓN\nEN TIEMPO REAL' },
];

// Auto-rotating designs (color variants of the brand shirt)
const DESIGNS = ['#D8CFBE', '#2B3A55', '#6E7B6B', '#1c1c1c'];

const Home = () => {
  const controls = useAnimationControls();
  const [, setIdx] = useState(0);

  useEffect(() => {
    state.color = DESIGNS[0];
    const id = setInterval(async () => {
      await controls.start({ x: '-55%', opacity: 0, transition: { duration: 0.35, ease: 'easeIn' } });
      setIdx((prev) => {
        const next = (prev + 1) % DESIGNS.length;
        state.color = DESIGNS[next];
        return next;
      });
      controls.set({ x: '55%' });
      await controls.start({ x: '0%', opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } });
    }, 4000);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="home">
      <Navbar />

      <div className="hero">
        <div className="gender-pills lg:hidden">
          <button className="pill pill-dark"><UserIcon /> Hombre</button>
          <button className="pill pill-outline"><UserIcon /> Mujer</button>
        </div>

        <motion.div className="hero-title" {...headTextAnimation}>
          <h1 className="head-text">VISTE <br /> TU FE.</h1>
        </motion.div>

        <motion.div className="hero-text" {...headContentAnimation}>
          <p className="hero-subtitle">Diseños que hablan de lo que crees.</p>
          <p className="hero-desc">
            Personaliza colores, estampados y versículos en tiempo real.
          </p>
          <div className="hero-cta">
            <button className="btn-beige" onClick={() => (state.intro = false)}>
              Personalizar ahora <span aria-hidden>→</span>
            </button>
            <button className="btn-ghost lg:inline-flex hidden" type="button">
              Ver diseños <span aria-hidden>→</span>
            </button>
          </div>
        </motion.div>

        <motion.div className="hero-canvasbox" animate={controls}>
          <Canvas />
        </motion.div>
      </div>

      <div className="features">
        {features.map((f) => (
          <div className="feature" key={f.label}>
            <span className="feature-icon">{f.icon}</span>
            <span className="feature-label">{f.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Home
