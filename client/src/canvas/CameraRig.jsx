import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';

import state from '../store';

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);

  useFrame((state, delta) => {
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    if (snap.intro) {
      // On the home the shirt is centered with enough margin that the breeze
      // sway/scale never crops it. The shirt itself gets the motion (breeze).
      const targetPosition = isMobile ? [0, 0, 1.8] : [0, 0, 1.65];
      easing.damp3(state.camera.position, targetPosition, 0.25, delta);
      easing.dampE(group.current.rotation, [0, 0, 0], 0.25, delta);
    } else {
      // In the customizer PresentationControls rotates the shirt and CameraZoom
      // owns the zoom factor. The rig just keeps the camera centered and the
      // group upright.
      const targetPosition = isMobile ? [0, -0.04, 2.15] : [0, -0.04, 2.35];
      easing.damp3(state.camera.position, targetPosition, 0.25, delta);
      easing.dampE(group.current.rotation, [0, 0, 0], 0.25, delta);
    }
  })


  return <group ref={group}>{children}</group>
}

export default CameraRig