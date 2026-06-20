import React from 'react'
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';

import state from '../store';

// Warm the cache for every print the hero cycles through, so swapping the
// design is instant and the shirt never blanks out while a texture loads.
['./brand-logo.png', './threejs.png', './react.png'].forEach((src) => useTexture.preload(src));

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('/shirt_baked.glb');

  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);
  const logoBackTexture = useTexture(snap.logoDecalBack);

  useFrame((state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta));

  // Remount only when a decal is toggled on/off (its child appears/disappears
  // and must re-project). Swapping the print image just updates the Decal's map
  // reactively — no remount, so the shirt never disappears and reloads.
  const key = `${snap.isLogoTexture ? 1 : 0}${snap.isLogoBack ? 1 : 0}${snap.isFullTexture ? 1 : 0}`;

  return (
    <group key={key}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {snap.isFullTexture && (
          <Decal 
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}

        {snap.isLogoTexture && (
          <Decal
            position={[snap.logoOffsetX, 0.04 + snap.logoOffsetY, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15 * snap.logoScale}
            map={logoTexture}
            map-anisotropy={16}
          />
        )}

        {snap.isLogoBack && (
          <Decal
            position={[-snap.logoBackOffsetX, 0.04 + snap.logoBackOffsetY, -0.15]}
            rotation={[0, Math.PI, 0]}
            scale={0.26 * snap.logoBackScale}
            map={logoBackTexture}
            map-anisotropy={16}
          />
        )}
      </mesh>
    </group>
  )
}

export default Shirt