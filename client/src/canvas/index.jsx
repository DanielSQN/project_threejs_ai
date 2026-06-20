import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Center } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import { easing } from 'maath';

import state from '../store';
import Shirt from './Shirt';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';
import CameraZoom from './CameraZoom';

// In the editor the shirt rotation is a single value (state.shirtRotY) shared by
// both the drag and the Frente/Espalda buttons, so they never disagree.
const RotateGroup = ({ children }) => {
  const ref = useRef();
  useFrame((_, delta) => {
    easing.dampAngle(ref.current.rotation, 'y', state.shirtRotY, 0.18, delta);
  });
  return <group ref={ref}>{children}</group>;
};

// Drag (mouse/one finger) rotates the shirt and keeps activeView (front/back)
// in sync so the toggle highlights the side you are looking at. Two-finger
// gestures are left to CameraZoom (pinch).
const DragRotate = () => {
  const { gl } = useThree();
  useEffect(() => {
    const el = gl.domElement;
    const pointers = new Set();
    let lastX = 0;
    const down = (e) => {
      pointers.add(e.pointerId);
      if (pointers.size === 1) lastX = e.clientX;
    };
    const move = (e) => {
      if (pointers.size !== 1 || !pointers.has(e.pointerId)) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      state.shirtRotY += dx * 0.01;
      const n = ((state.shirtRotY % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const v = n > Math.PI / 2 && n < Math.PI * 1.5 ? 'back' : 'front';
      if (state.activeView !== v) state.activeView = v;
    };
    const up = (e) => { pointers.delete(e.pointerId); };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [gl]);
  return null;
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
    life.current = Math.min(1, life.current + delta / 0.6);
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

    // slow continuous 360 turn (subtle turntable) + breeze sway + gust
    ref.current.rotation.z = Math.sin(t * 0.8) * 0.04 + Math.sin(t * 7) * 0.06 * g;
    ref.current.rotation.y = t * 0.3 + Math.sin(t * 5) * 0.11 * g;
  });
  return <group ref={ref}>{children}</group>;
};

const CanvasModel = () => {
  const snap = useSnapshot(state);

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
          <RotateGroup>
            <Center>
              <Shirt />
            </Center>
          </RotateGroup>
        )}
      </CameraRig>

      {!snap.intro && <DragRotate />}
      {!snap.intro && <CameraZoom enabled={!snap.intro} />}
    </Canvas>
  )
}

export default CanvasModel