import { useSnapshot } from 'valtio';

import Customizer from './pages/Customizer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Toast from './components/Toast';
import state from './store';

function App() {
  const snap = useSnapshot(state);

  return (
    <main className="app transition-all ease-in">
      {snap.intro ? <Home /> : <Customizer />}
      {snap.cartOpen && <Cart />}
      <Toast />
    </main>
  )
}

export default App
