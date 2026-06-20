import { useSnapshot } from 'valtio';

import Customizer from './pages/Customizer';
import Home from './pages/Home';
import SectionPage from './pages/SectionPage';
import Cart from './pages/Cart';
import Toast from './components/Toast';
import state from './store';

function App() {
  const snap = useSnapshot(state);

  let view;
  if (!snap.intro) view = <Customizer />;
  else if (snap.page === 'home') view = <Home />;
  else view = <SectionPage />;

  return (
    <main className="app transition-all ease-in">
      {view}
      {snap.cartOpen && <Cart />}
      <Toast />
    </main>
  );
}

export default App;
