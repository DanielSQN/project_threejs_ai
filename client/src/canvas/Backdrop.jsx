import React from 'react'
import { ContactShadows } from '@react-three/drei';

// A soft ground contact shadow. Unlike AccumulativeShadows it renders cleanly
// each frame (no multi-frame temporal accumulation), so it never leaves a
// ghost when the camera zooms and never turns into a gray panel when the shirt
// rotates.
const Backdrop = () => {
  return (
    <ContactShadows
      position={[0, -0.62, 0]}
      opacity={0.55}
      scale={4}
      blur={2.2}
      far={1}
      resolution={512}
      color="#000000"
    />
  )
}

export default Backdrop
