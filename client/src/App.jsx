import { useSnapshot } from 'valtio';

import Canvas from './canvas';
import Customizer from './pages/Customizer';
import Home from './pages/Home';
import state from './store';

function App() {
  const snap = useSnapshot(state);

  return (
    <main className="app transition-all ease-in">
      {snap.intro ? (
        <Home />
      ) : (
        <>
          <div className="canvas-fullscreen">
            <Canvas />
          </div>
          <Customizer />
        </>
      )}
    </main>
  )
}

export default App
