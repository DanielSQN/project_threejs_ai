import { useSnapshot } from 'valtio';
import { MotionConfig } from 'framer-motion';

import Customizer from './pages/Customizer';
import Home from './pages/Home';
import SectionPage from './pages/SectionPage';
import Cart from './pages/Cart';
import Toast from './components/Toast';
import { WhatsAppFab } from './components/Social';
import useHistorySync from './hooks/useHistorySync';
import state from './store';

function App() {
  const snap = useSnapshot(state);
  useHistorySync();

  let view;
  if (!snap.intro) view = <Customizer />;
  else if (snap.page === 'home') view = <Home />;
  else view = <SectionPage />;

  return (
    <MotionConfig reducedMotion="user">
    <main className="app">
      {view}
      {snap.cartOpen && <Cart />}
      <Toast />
      {snap.intro && !snap.cartOpen && <WhatsAppFab afterScroll={snap.page === 'home'} />}
    </main>
    </MotionConfig>
  );
}

export default App;
