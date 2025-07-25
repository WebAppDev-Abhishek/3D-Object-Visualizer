import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

/**
 * Custom React hook for setting up and managing a Three.js scene.
 * @param {React.RefObject} mountRef - A ref to the DOM element where the Three.js canvas will be mounted.
 * @param {string} backgroundColor - The background color of the scene.
 * @returns {{
 * scene: THREE.Scene | null,
 * camera: THREE.PerspectiveCamera | null,
 * renderer: THREE.WebGLRenderer | null,
 * controls: OrbitControls | null,
 * transformControls: TransformControls | null,
 * gridHelper: THREE.GridHelper | null,
 * centerGridLines: THREE.Group | null
 * }}
 */
export const useThreeScene = (mountRef, backgroundColor) => {
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [controls, setControls] = useState(null);
  const [transformControls, setTransformControls] = useState(null);
  const [gridHelper, setGridHelper] = useState(null);
  const [centerGridLines, setCenterGridLines] = useState(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene Setup
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(backgroundColor);

    // 2. Camera Setup
    const newCamera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    newCamera.position.set(0, 10, 20);

    // 3. Renderer Setup
    const newRenderer = new THREE.WebGLRenderer({ antialias: true });
    newRenderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(newRenderer.domElement);

    // 4. OrbitControls for camera navigation
    const newControls = new OrbitControls(newCamera, newRenderer.domElement);
    newControls.enableDamping = true;
    newControls.dampingFactor = 0.05;
    newControls.autoRotate = false;
    newControls.autoRotateSpeed = 2.0;

    // 5. TransformControls for object manipulation
    const newTransformControls = new TransformControls(newCamera, newRenderer.domElement);
    newScene.add(newTransformControls);

    // Event listener to disable OrbitControls when TransformControls is active
    newTransformControls.addEventListener('dragging-changed', function (event) {
      newControls.enabled = !event.value;
    });

    // 6. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    newScene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    newScene.add(directionalLight);

    // 7. Grid Helper
    const size = 50;
    const divisions = 200;
    const colorCenterLine = 0x888888;
    const colorGrid = 0xbbbbbb;
    const newGridHelper = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);
    newGridHelper.userData.isStatic = true; // Mark as static to ignore during object selection
    newScene.add(newGridHelper);

    // Add highlighted center lines for the grid
    const material = new THREE.LineBasicMaterial({ color: 0xadd8e6, linewidth: 2 });
    const pointsX = [];
    pointsX.push(new THREE.Vector3(-size / 2, 0, 0));
    pointsX.push(new THREE.Vector3(size / 2, 0, 0));
    const geometryX = new THREE.BufferGeometry().setFromPoints(pointsX);
    const lineX = new THREE.Line(geometryX, material);
    lineX.userData.isStatic = true;
    newScene.add(lineX);

    const pointsZ = [];
    pointsZ.push(new THREE.Vector3(0, 0, -size / 2));
    pointsZ.push(new THREE.Vector3(0, 0, size / 2));
    const geometryZ = new THREE.BufferGeometry().setFromPoints(pointsZ);
    const lineZ = new THREE.Line(geometryZ, material);
    lineZ.userData.isStatic = true;
    newScene.add(lineZ);

    // Set states
    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);
    setControls(newControls);
    setTransformControls(newTransformControls);
    setGridHelper(newGridHelper);
    setCenterGridLines(new THREE.Group().add(lineX, lineZ));

    // Handle window resize
    const handleResize = () => {
      if (newCamera && newRenderer && currentMount) {
        newCamera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        newCamera.updateProjectionMatrix();
        newRenderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount && newRenderer.domElement) {
        currentMount.removeChild(newRenderer.domElement);
      }
      // Dispose of Three.js resources to prevent memory leaks
      newRenderer.dispose();
      newControls.dispose();
      newTransformControls.dispose();
      newScene.remove(newTransformControls);
      newGridHelper.dispose();
      material.dispose();
      geometryX.dispose();
      geometryZ.dispose();
      newScene.remove(lineX);
      newScene.remove(lineZ);
      newScene.remove(ambientLight);
      newScene.remove(directionalLight);
      newScene.traverse((object) => {
        if (object.isMesh || object.isLine || object.isLight) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (object.material.map) object.material.map.dispose();
            object.material.dispose();
          }
        }
      });
    };
  }, [mountRef, backgroundColor]); // Re-run if mountRef or background color changes

  return { scene, camera, renderer, controls, transformControls, gridHelper, centerGridLines };
};
