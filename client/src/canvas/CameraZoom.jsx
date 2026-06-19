import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { easing } from 'maath';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

// Zoom via the camera's zoom factor (not its position), so it never fights
// CameraRig (which centers the camera) or PresentationControls (which rotates
// the shirt). Higher zoom = closer.
const CameraZoom = ({ enabled = true, onPinchChange }) => {
  const { gl, camera } = useThree();
  const targetZoom = useRef(camera.zoom || 1);
  const pinchDist = useRef(null);

  const clamp = (z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

  useEffect(() => {
    if (enabled) targetZoom.current = clamp(camera.zoom || 1);
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!enabled) return;
    const el = gl.domElement;

    const onWheel = (e) => {
      e.preventDefault();
      // scroll up (deltaY < 0) zooms in
      targetZoom.current = clamp(targetZoom.current - e.deltaY * 0.001);
    };

    const twoFingerDist = (touches) =>
      Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
      );

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        pinchDist.current = twoFingerDist(e.touches);
        onPinchChange?.(true);
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 2 && pinchDist.current != null) {
        e.preventDefault();
        const d = twoFingerDist(e.touches);
        // fingers spreading apart zooms in
        targetZoom.current = clamp(targetZoom.current + (d - pinchDist.current) * 0.005);
        pinchDist.current = d;
      }
    };

    const endPinch = (e) => {
      if (e.touches.length < 2 && pinchDist.current != null) {
        pinchDist.current = null;
        onPinchChange?.(false);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', endPinch);
    el.addEventListener('touchcancel', endPinch);

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', endPinch);
      el.removeEventListener('touchcancel', endPinch);
    };
  }, [enabled, gl]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((_, delta) => {
    if (!enabled) return;
    if (Math.abs(camera.zoom - targetZoom.current) > 0.0001) {
      easing.damp(camera, 'zoom', targetZoom.current, 0.15, delta);
      camera.updateProjectionMatrix();
    }
  });

  return null;
};

export default CameraZoom;
