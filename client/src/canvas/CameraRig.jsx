import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';

import state from '../store';
import { cam } from './cameraControl';

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);

  useFrame((rs, delta) => {
    const isMobile = window.innerWidth <= 600;

    if (snap.intro) {
      // Home: shirt centered and large. Closer camera = bigger shirt; kept far
      // enough that the breeze sway/scale never crops it.
      const targetPosition = isMobile ? [0, 0, 1.55] : [0, 0, 1.5];
      easing.damp3(rs.camera.position, targetPosition, 0.25, delta);
      easing.dampE(group.current.rotation, [0, 0, 0], 0.25, delta);
    } else {
      // Customizer: pulled back so the sleeves stay on screen. CameraZoom owns
      // the zoom factor and writes a pan offset (zoom-to-cursor) that we add to
      // the centered target here.
      const baseZ = isMobile ? 2.55 : 2.7;
      const targetPosition = [cam.panX, -0.04 + cam.panY, baseZ];
      easing.damp3(rs.camera.position, targetPosition, 0.22, delta);
      easing.dampE(group.current.rotation, [0, 0, 0], 0.25, delta);
    }
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
