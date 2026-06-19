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
      // On the home the shirt sits inside its own (centered) canvas box,
      // with a subtle pointer tilt for life.
      const targetPosition = isMobile ? [0, 0, 2.6] : [0, 0, 2.2];
      easing.damp3(state.camera.position, targetPosition, 0.25, delta);

      easing.dampE(
        group.current.rotation,
        [state.pointer.y / 12, -state.pointer.x / 8, 0],
        0.25,
        delta
      );
    } else {
      // In the customizer PresentationControls rotates the shirt and CameraZoom
      // owns the zoom factor. The rig just keeps the camera centered and the
      // group upright.
      const targetPosition = isMobile ? [0, 0, 2.5] : [0, 0, 2];
      easing.damp3(state.camera.position, targetPosition, 0.25, delta);
      easing.dampE(group.current.rotation, [0, 0, 0], 0.25, delta);
    }
  })


  return <group ref={group}>{children}</group>
}

export default CameraRig