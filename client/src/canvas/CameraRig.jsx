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
      // On the home page the rig drives the camera and a subtle pointer tilt
      let targetPosition = [-0.4, 0, 2];
      if (isBreakpoint) targetPosition = [0, 0, 2];
      if (isMobile) targetPosition = [0, 0.2, 2.5];

      easing.damp3(state.camera.position, targetPosition, 0.25, delta);

      easing.dampE(
        group.current.rotation,
        [state.pointer.y / 10, -state.pointer.x / 5, 0],
        0.25,
        delta
      );
    } else {
      // In the customizer the camera is centered and fixed; PresentationControls
      // rotates the shirt on its own, so the rig keeps its group upright.
      const targetPosition = isMobile ? [0, 0, 2.5] : [0, 0, 2];
      easing.damp3(state.camera.position, targetPosition, 0.25, delta);
      easing.dampE(group.current.rotation, [0, 0, 0], 0.25, delta);
    }
  })


  return <group ref={group}>{children}</group>
}

export default CameraRig