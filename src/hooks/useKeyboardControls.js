import { useEffect, useState } from 'react';
import * as THREE from 'three';

/**
 * Custom React hook for handling keyboard controls for camera movement.
 * @param {THREE.Camera | null} camera - The Three.js camera object.
 * @param {OrbitControls | null} controls - The OrbitControls instance.
 * @param {boolean} isCameraMotionEnabled - State indicating if camera motion is enabled.
 * @param {function} setIsCameraMotionEnabled - Setter for isCameraMotionEnabled.
 * @param {boolean} isAutoRotating - State indicating if auto-rotation is enabled.
 * @param {function} setIsAutoRotating - Setter for isAutoRotating.
 */
export const useKeyboardControls = (camera, controls, isCameraMotionEnabled, setIsCameraMotionEnabled, isAutoRotating, setIsAutoRotating) => {
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);

  const movementSpeed = 0.5;

  // Effect for handling keyboard input
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp': setMoveForward(true); break;
        case 'ArrowDown': setMoveBackward(true); break;
        case 'ArrowLeft': setMoveLeft(true); break;
        case 'ArrowRight': setMoveRight(true); break;
        case ' ': // Spacebar
          event.preventDefault(); // Prevent default spacebar action (e.g., scrolling)
          setIsCameraMotionEnabled(prev => {
            const newState = !prev;
            if (controls) {
              controls.enabled = newState; // Enable/disable OrbitControls
              // If auto-rotate was on and motion is now disabled, turn off auto-rotate
              if (!newState && controls.autoRotate) {
                controls.autoRotate = false;
                setIsAutoRotating(false);
              }
              // If auto-rotate was on and motion is now re-enabled, keep auto-rotate on
              if (newState && isAutoRotating) {
                controls.autoRotate = true;
              }
            }
            return newState;
          });
          break;
        default: break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key) {
        case 'ArrowUp': setMoveForward(false); break;
        case 'ArrowDown': setMoveBackward(false); break;
        case 'ArrowLeft': setMoveLeft(false); break;
        case 'ArrowRight': setMoveRight(false); break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [controls, isAutoRotating, setIsCameraMotionEnabled, setIsAutoRotating]); // Dependencies for keyboard listeners

  // Effect for applying camera movement in the animation loop
  useEffect(() => {
    if (!camera || !isCameraMotionEnabled) return;

    const animateMovement = () => {
      if (moveForward || moveBackward || moveLeft || moveRight) {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        if (moveForward) camera.position.addScaledVector(direction, movementSpeed);
        if (moveBackward) camera.position.addScaledVector(direction, -movementSpeed);

        const right = new THREE.Vector3();
        right.crossVectors(camera.up, direction);
        right.normalize();

        if (moveLeft) camera.position.addScaledVector(right, -movementSpeed);
        if (moveRight) camera.position.addScaledVector(right, movementSpeed);
      }
      requestAnimationFrame(animateMovement);
    };

    const animationFrameId = requestAnimationFrame(animateMovement);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [camera, isCameraMotionEnabled, moveForward, moveBackward, moveLeft, moveRight]); // Dependencies for movement application
};
