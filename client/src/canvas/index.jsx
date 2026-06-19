import { Canvas } from '@react-three/fiber'
import { Center, PresentationControls } from '@react-three/drei';
import { useSnapshot } from 'valtio';

import state from '../store';
import Shirt from './Shirt';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';

const CanvasModel = () => {
  const snap = useSnapshot(state);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 0], fov: 25 }}
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
          <Center>
            <Shirt />
          </Center>
        ) : (
          // Turntable: the shirt rotates on itself, camera and shadow stay put
          <PresentationControls
            global
            snap={false}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 6, Math.PI / 6]}
            azimuth={[-Infinity, Infinity]}
            config={{ mass: 1, tension: 300, friction: 30 }}
          >
            <Center>
              <Shirt />
            </Center>
          </PresentationControls>
        )}
      </CameraRig>
    </Canvas>
  )
}

export default CanvasModel