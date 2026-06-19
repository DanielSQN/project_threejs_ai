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

// On the home the shirt stays in place but gets a gentle "breeze": a soft sway
// plus a subtle scale breathing, and a small scale-in on mount.
const BreezeGroup = ({ children }) => {
  const ref = useRef();
  const life = useRef(0);
  useFrame((st, delta) => {
    life.current = Math.min(1, life.current + delta / 0.8);
    const t = st.clock.elapsedTime;
    ref.current.rotation.z = Math.sin(t * 0.8) * 0.035;
    ref.current.rotation.y = Math.sin(t * 0.5) * 0.06;
    const breathe = 1 + Math.sin(t * 1.2) * 0.01;
    ref.current.scale.setScalar((0.92 + 0.08 * life.current) * breathe);
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