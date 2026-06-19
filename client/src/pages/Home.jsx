import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state from '../store';
import Navbar from '../components/Navbar';
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation
} from '../config/motion';

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Home = () => {
  const snap = useSnapshot(state);

  return (
    <AnimatePresence>
      {snap.intro && (
        <>
          <motion.div {...slideAnimation('down')} className="absolute top-0 left-0 w-full z-20">
            <Navbar />
          </motion.div>

          <motion.section className="home" {...slideAnimation('left')}>
            <div className="gender-pills lg:hidden">
              <button className="pill pill-dark"><UserIcon /> Hombre</button>
              <button className="pill pill-outline"><UserIcon /> Mujer</button>
            </div>

            <motion.div className="home-content" {...headContainerAnimation}>
              <motion.div {...headTextAnimation}>
                <h1 className="head-text">
                  VISTE <br /> TU FE.
                </h1>
                <p className="hero-subtitle">Diseños que hablan de lo que crees.</p>
              </motion.div>

              <motion.div
                {...headContentAnimation}
                className="flex flex-col gap-6 items-center lg:items-start"
              >
                <p className="hero-desc">
                  Personaliza colores, estampados y vestuario en tiempo real con nuestra herramienta 3D.
                </p>

                <div className="hero-cta">
                  <button className="btn-dark" onClick={() => (state.intro = false)}>
                    Personalizar ahora
                  </button>
                  <button className="btn-ghost" type="button">
                    Ver diseños
                    <span aria-hidden>→</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.section>

          <motion.div {...slideAnimation('up')} className="hero-dots">
            <button className="dots-arrow" aria-label="Anterior">‹</button>
            <span className="dot active" />
            <span className="dot" />
            <span className="dot" />
            <button className="dots-arrow" aria-label="Siguiente">›</button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Home
