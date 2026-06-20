// Shared, render-free camera control state for the customizer.
// Mutated imperatively by CameraZoom (input) and read by CameraRig (position)
// inside useFrame, so high-frequency zoom/pan never triggers React re-renders.
export const cam = {
  targetZoom: 1, // desired magnification (1 = fit)
  panX: 0, // view-plane offset added to the centered camera target
  panY: 0,
};

export const recenter = () => {
  cam.targetZoom = 1;
  cam.panX = 0;
  cam.panY = 0;
};

export const resetCam = () => {
  cam.targetZoom = 1;
  cam.panX = 0;
  cam.panY = 0;
};
