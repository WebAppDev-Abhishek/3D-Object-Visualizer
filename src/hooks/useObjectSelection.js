import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Custom React hook for handling object selection in a Three.js scene.
 * @param {React.RefObject} mountRef - Ref to the DOM element containing the canvas.
 * @param {THREE.Scene | null} scene - The Three.js scene object.
 * @param {THREE.Camera | null} camera - The Three.js camera object.
 * @param {THREE.WebGLRenderer | null} renderer - The Three.js renderer object.
 * @param {TransformControls | null} transformControls - The TransformControls instance.
 * @param {Array<THREE.Object3D>} liveSceneObjects - Array of managed Three.js objects in the scene.
 * @param {string | null} selectedObjectId - The ID of the currently selected object.
 * @param {function} setSelectedObjectId - Setter for selectedObjectId.
 */
export const useObjectSelection = (mountRef, scene, camera, renderer, transformControls, liveSceneObjects, selectedObjectId, setSelectedObjectId) => {
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount || !scene || !camera || !renderer || !transformControls || !liveSceneObjects) return;

    const onPointerDown = (event) => {
      // If TransformControls is actively dragging, do not attempt new selection
      if (transformControls && transformControls.dragging) {
        return;
      }

      // Calculate mouse position in normalized device coordinates (-1 to +1)
      mouse.current.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);

      // Intersect only the objects we manage (meshes and point lights)
      // This array contains the top-level THREE.Object3D instances
      const intersects = raycaster.current.intersectObjects(liveSceneObjects, true);

      if (intersects.length > 0) {
        // The intersected object is guaranteed to be one of our liveSceneObjects or its child (like a light helper)
        let intersectedObject = intersects[0].object;
        let targetObject = null;

        // Traverse up to find the actual top-level object from liveSceneObjects
        while (intersectedObject) {
          if (liveSceneObjects.includes(intersectedObject)) { // Check if it's one of our managed top-level objects
            targetObject = intersectedObject;
            break;
          }
          intersectedObject = intersectedObject.parent;
        }

        if (targetObject) {
          if (selectedObjectId === targetObject.userData.id) {
            // Clicked on the same object, deselect
            setSelectedObjectId(null);
          } else {
            // Select new object
            setSelectedObjectId(targetObject.userData.id);
          }
        } else {
          // Clicked on a child of a managed object, but parent not found in liveSceneObjects. Deselecting.
          setSelectedObjectId(null);
        }
      } else {
        // Clicked on empty space or static scene elements (grid, ambient light)
        setSelectedObjectId(null);
      }
    };

    currentMount.addEventListener('pointerdown', onPointerDown);

    return () => {
      currentMount.removeEventListener('pointerdown', onPointerDown);
    };
  }, [mountRef, scene, camera, renderer, transformControls, liveSceneObjects, selectedObjectId, setSelectedObjectId]);
};
