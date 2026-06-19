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
            <motion.div className="home-content" {...headContainerAnimation}>
              <motion.div {...headTextAnimation}>
                <p className="hero-eyebrow">Diseños que hablan de lo que crees</p>
                <h1 className="head-text">
                  VISTE <br className="xl:block hidden" /> TU FE.
                </h1>
              </motion.div>

              <motion.div
                {...headContentAnimation}
                className="flex flex-col gap-7"
              >
                <p className="hero-desc">
                  Diseños únicos, estampados y vestuario que conectan con tu fe.
                  Personalízalos en 3D y <strong>llévalos contigo</strong> con tu propio estilo.
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
            <span className="dot active" />
            <span className="dot" />
            <span className="dot" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Home
