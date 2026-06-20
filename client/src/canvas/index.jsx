import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, PresentationControls } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import { easing } from 'maath';

import state from '../store';
import Shirt from './Shirt';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';
import CameraZoom from './CameraZoom';

// Rotates the shirt to the front or the back when the view toggle changes,
// while PresentationControls still allows free dragging on top.
const ViewGroup = ({ children }) => {
  const ref = useRef();
  const snap = useSnapshot(state);
  useFrame((_, delta) => {
    const targetY = snap.activeView === 'back' ? Math.PI : 0;
    easing.dampAngle(ref.current.rotation, 'y', targetY, 0.3, delta);
  });
  return <group ref={ref}>{children}</group>;
};

const easeOut = (x) => 1 - Math.pow(1 - x, 3);

// On the home the camera stays fixed and centered; this group gives the shirt:
//  - an entrance from small + slightly offset to full + centered (ease-out),
//  - a continuous gentle breeze (soft sway + scale breathing),
//  - a quick wind "gust" each time the design changes (state.breezeTick).
// The shirt never leaves its spot and never gets cropped.
const BreezeGroup = ({ children }) => {
  const ref = useRef();
  const life = useRef(0);
  const gust = useRef(0);
  const prevTick = useRef(state.breezeTick);
  useFrame((st, delta) => {
    life.current = Math.min(1, life.current + delta / 1.1);
    const e = easeOut(life.current);

    if (state.breezeTick !== prevTick.current) {
      prevTick.current = state.breezeTick;
      gust.current = 1;
    }
    gust.current = Math.max(0, gust.current - delta * 1.3);
    const t = st.clock.elapsedTime;
    const g = gust.current;

    // entrance: small + offset -> full + centered, then a continuous gentle drift
    ref.current.position.x = (1 - e) * 0.22 + e * Math.sin(t * 0.6) * 0.03;
    ref.current.position.y = (1 - e) * 0.18 + e * Math.sin(t * 0.9) * 0.02;
    const entranceScale = 0.6 + 0.4 * e;
    const breathe = 1 + Math.sin(t * 1.2) * 0.01 + g * 0.025;
    ref.current.scale.setScalar(entranceScale * breathe);

    // breeze + gust (a touch stronger for more life)
    ref.current.rotation.z = Math.sin(t * 0.8) * 0.05 + Math.sin(t * 7) * 0.06 * g;
    ref.current.rotation.y = Math.sin(t * 0.5) * 0.1 + Math.sin(t * 5) * 0.11 * g;
  });
  return <group ref={ref}>{children}</group>;
};

const CanvasModel = () => {
  const snap = useSnapshot(state);
  const [pinching, setPinching] = useState(false);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 2.4], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full max-w-full h-full transition-all ease-in"
    >
      <ambientLight intensity={0.5} />
      <hemisphereLight intensity={0.5} groundColor="black" />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.6} />

      <CameraRig>
        {/* Shadow stays outside the rotatable group so it never moves */}
        <Backdrop />

        {snap.intro ? (
          <BreezeGroup>
            <Center>
              <Shirt />
            </Center>
          </BreezeGroup>
        ) : (
          // Turntable: the shirt rotates on itself, camera and shadow stay put
          <PresentationControls
            enabled={!pinching}
            global
            snap={false}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 6, Math.PI / 6]}
            azimuth={[-Infinity, Infinity]}
            config={{ mass: 1, tension: 500, friction: 26 }}
          >
            <ViewGroup>
              <Center>
                <Shirt />
              </Center>
            </ViewGroup>
          </PresentationControls>
        )}
      </CameraRig>

      {!snap.intro && (
        <CameraZoom enabled={!snap.intro} onPinchChange={setPinching} />
      )}
    </Canvas>
  )
}

export default CanvasModel