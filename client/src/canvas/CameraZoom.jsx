import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { easing } from 'maath';

import { cam } from './cameraControl';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

// Zoom magnifies via the camera's zoom factor, and pans the camera so the point
// you pinch / scroll over stays under your finger (zoom-to-cursor). The pan is
// stored in the shared `cam` object and applied by CameraRig, so it never fights
// the centering rig. `recenter()` resets both.
const CameraZoom = ({ enabled = true, onPinchChange }) => {
  const { gl, camera } = useThree();
  const pinchDist = useRef(null);

  const clampZoom = (z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

  // half-height of the view (world units) on the shirt plane for a given zoom
  const viewHalf = (zoom) => Math.tan((camera.fov * Math.PI) / 180 / 2) * Math.abs(camera.position.z) / zoom;

  // keep panning within what the current zoom actually reveals, and collapse to
  // centered as zoom returns to 1
  const clampPan = () => {
    const room = Math.max(0, 1 - 1 / cam.targetZoom) * 0.6;
    cam.panX = Math.min(room, Math.max(-room, cam.panX));
    cam.panY = Math.min(room, Math.max(-room, cam.panY));
  };

  // focal NDC point (-1..1) from a client x/y over the canvas
  const ndc = (clientX, clientY) => {
    const r = gl.domElement.getBoundingClientRect();
    return [((clientX - r.left) / r.width) * 2 - 1, -(((clientY - r.top) / r.height) * 2 - 1)];
  };

  // change zoom while holding the focal screen point fixed
  const zoomAt = (nextZoom, nx, ny) => {
    const z0 = cam.targetZoom;
    const z1 = clampZoom(nextZoom);
    if (z1 === z0) return;
    const aspect = camera.aspect || 1;
    const dHalf = viewHalf(z1) - viewHalf(z0);
    cam.panX += -nx * aspect * dHalf;
    cam.panY += -ny * dHalf;
    cam.targetZoom = z1;
    clampPan();
  };

  useEffect(() => {
    if (!enabled) return undefined;
    const el = gl.domElement;

    const onWheel = (e) => {
      e.preventDefault();
      const [nx, ny] = ndc(e.clientX, e.clientY);
      zoomAt(cam.targetZoom - e.deltaY * 0.0015, nx, ny);
    };

    const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const mid = (t) => [(t[0].clientX + t[1].clientX) / 2, (t[0].clientY + t[1].clientY) / 2];

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        pinchDist.current = dist(e.touches);
        onPinchChange?.(true);
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 2 && pinchDist.current != null) {
        e.preventDefault();
        const d = dist(e.touches);
        const [mx, my] = mid(e.touches);
        const [nx, ny] = ndc(mx, my);
        zoomAt(cam.targetZoom + (d - pinchDist.current) * 0.006, nx, ny);
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
    if (Math.abs(camera.zoom - cam.targetZoom) > 0.0001) {
      easing.damp(camera, 'zoom', cam.targetZoom, 0.15, delta);
      camera.updateProjectionMatrix();
    }
  });

  return null;
};

export default CameraZoom;
