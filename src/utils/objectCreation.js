import * as THREE from 'three';

/**
 * Creates a Three.js Object3D (Mesh or Light) based on provided data.
 * Stores original color in userData for highlighting.
 * @param {object} objectData - Data object describing the object to create.
 * @param {string} objectData.type - The type of object ('box', 'sphere', 'pointLight', etc.).
 * @param {number} objectData.color - The color of the object in hexadecimal.
 * @param {THREE.Vector3} objectData.position - The position of the object.
 * @param {THREE.Vector3} objectData.rotation - The rotation of the object.
 * @param {THREE.Vector3} objectData.scale - The scale of the object.
 * @param {number} [objectData.intensity] - Intensity for lights.
 * @param {string} [objectData.imageUrl] - URL for image planes.
 * @param {number} [objectData.aspectRatio] - Aspect ratio for image planes.
 * @returns {THREE.Object3D} The created Three.js object.
 */
export const createThreeObjectFromData = (objectData) => {
  let object3D;
  let geometry;
  let material;

  switch (objectData.type) {
    case 'box':
      geometry = new THREE.BoxGeometry(2, 2, 2);
      material = new THREE.MeshPhongMaterial({ color: objectData.color });
      object3D = new THREE.Mesh(geometry, material);
      object3D.userData.originalColor = objectData.color; // Store original color
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry(1.5, 32, 32);
      material = new THREE.MeshPhongMaterial({ color: objectData.color });
      object3D = new THREE.Mesh(geometry, material);
      object3D.userData.originalColor = objectData.color; // Store original color
      break;
    case 'cylinder':
      geometry = new THREE.CylinderGeometry(1, 1, 3, 32);
      material = new THREE.MeshPhongMaterial({ color: objectData.color });
      object3D = new THREE.Mesh(geometry, material);
      object3D.userData.originalColor = objectData.color; // Store original color
      break;
    case 'cone':
      geometry = new THREE.ConeGeometry(1.5, 3, 32);
      material = new THREE.MeshPhongMaterial({ color: objectData.color });
      object3D = new THREE.Mesh(geometry, material);
      object3D.userData.originalColor = objectData.color; // Store original color
      break;
    case 'torus':
      geometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
      material = new THREE.MeshPhongMaterial({ color: objectData.color });
      object3D = new THREE.Mesh(geometry, material);
      object3D.userData.originalColor = objectData.color; // Store original color
      break;
    case 'imagePlane':
      const planeWidth = 10; // Max width for the plane
      const planeHeight = planeWidth / objectData.aspectRatio;
      geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
      material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }); // Use BasicMaterial for textures

      // Load texture asynchronously and apply it
      new THREE.TextureLoader().load(objectData.imageUrl,
        (texture) => {
          material.map = texture;
          material.needsUpdate = true;
        },
        undefined, // onProgress callback
        (error) => {
          console.error('An error occurred while loading the texture:', error);
          // Optionally, set a fallback color or texture
          material.color.set(0x808080); // Grey fallback
          material.needsUpdate = true;
        }
      );
      object3D = new THREE.Mesh(geometry, material);
      object3D.userData.originalColor = objectData.color; // Store original color
      break;
    case 'pointLight':
      // PointLight takes color and intensity
      object3D = new THREE.PointLight(objectData.color, objectData.intensity, 100); // Distance 100
      // Add a helper as a child to the light for visualization and selection
      object3D.add(new THREE.PointLightHelper(object3D, 1));
      object3D.userData.originalColor = objectData.color; // Store original color
      break;
    default:
      geometry = new THREE.BoxGeometry(2, 2, 2); // Default to box
      material = new THREE.MeshPhongMaterial({ color: 0xcccccc });
      object3D = new THREE.Mesh(geometry, material);
      object3D.userData.originalColor = 0xcccccc; // Store original color
  }

  object3D.position.copy(objectData.position);
  object3D.rotation.setFromVector3(new THREE.Vector3(objectData.rotation.x, objectData.rotation.y, objectData.rotation.z));
  object3D.scale.copy(objectData.scale);
  object3D.userData.id = objectData.id; // Store the ID on the object for selection
  object3D.userData.type = objectData.type; // Store type for helper logic and UI
  return object3D;
};
