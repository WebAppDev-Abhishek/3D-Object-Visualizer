import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
// Import custom hooks and utilities
import { useThreeScene } from './hooks/useThreeScene';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useObjectSelection } from './hooks/useObjectSelection';
import { getLighterColor } from './utils/colorUtils';
import { createThreeObjectFromData } from './utils/objectCreation';
// Import UI component
import SceneControls from './components/SceneControls';

// Main App component for the 3D scene application
const App = () => {
  // Ref for the canvas element where the Three.js scene will be rendered
  const mountRef = useRef(null);

  // States for scene properties
  const [backgroundColor, setBackgroundColor] = useState('#f0f0f0');
  const [isGridVisible, setIsGridVisible] = useState(true);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isCameraMotionEnabled, setIsCameraMotionEnabled] = useState(true);

  // Use the custom hook for Three.js scene setup
  const { scene, camera, renderer, controls, transformControls, gridHelper, centerGridLines } = useThreeScene(mountRef, backgroundColor);

  // States for scene objects data and live instances
  const [sceneObjectsData, setSceneObjectsData] = useState([]);
  const [liveSceneObjects, setLiveSceneObjects] = useState([]);

  // States for object selection
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [currentSelectedObjectProps, setCurrentSelectedObjectProps] = useState(null);

  // States for undo/redo history
  const [sceneHistory, setSceneHistory] = useState([[]]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  // State for position input fields (for NEW objects)
  const [positionInputs, setPositionInputs] = useState({ x: 0, y: 0, z: 0 });

  // Use custom hooks for keyboard controls and object selection
  useKeyboardControls(camera, controls, isCameraMotionEnabled, setIsCameraMotionEnabled, isAutoRotating, setIsAutoRotating);
  useObjectSelection(mountRef, scene, camera, renderer, transformControls, liveSceneObjects, selectedObjectId, setSelectedObjectId);

  // Helper function to synchronize the Three.js scene with the sceneObjectsData state
  const syncSceneWithData = useCallback(() => {
    if (!scene || !renderer || !camera || !transformControls) return;

    // Detach transform controls before clearing the scene
    transformControls.detach();

    // Remove old live objects from the scene and dispose resources
    liveSceneObjects.forEach(obj => {
      scene.remove(obj);
      // Dispose of children (like light helpers)
      obj.traverse((child) => {
        if (child.isMesh || child.isLine) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        }
      });
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (obj.material.map) obj.material.map.dispose();
        obj.material.dispose();
      }
    });

    const newLiveSceneObjects = [];
    // Create new objects from current sceneObjectsData and add to scene
    sceneObjectsData.forEach(objectData => {
      const object3D = createThreeObjectFromData(objectData);
      scene.add(object3D);
      newLiveSceneObjects.push(object3D);
    });
    setLiveSceneObjects(newLiveSceneObjects);

    // Re-attach transform controls if the selected object still exists in the new live objects
    if (selectedObjectId) {
      const currentSelectedObject = newLiveSceneObjects.find(obj => obj.userData.id === selectedObjectId);
      if (currentSelectedObject) {
        transformControls.attach(currentSelectedObject);
      } else {
        setSelectedObjectId(null); // Deselect if object no longer exists
      }
    }
  }, [scene, renderer, camera, transformControls, sceneObjectsData, selectedObjectId, liveSceneObjects]);


  // Effect to update currentSelectedObjectProps when selectedObjectId or sceneObjectsData changes
  useEffect(() => {
      if (selectedObjectId && sceneObjectsData) {
          const selectedData = sceneObjectsData.find(obj => obj.id === selectedObjectId);
          if (selectedData) {
              // Clone position, rotation, scale to avoid direct mutation of state objects
              setCurrentSelectedObjectProps({
                  ...selectedData,
                  position: selectedData.position.clone(),
                  rotation: selectedData.rotation.clone(),
                  scale: selectedData.scale.clone(),
              });
          } else {
              setCurrentSelectedObjectProps(null); // Object no longer exists
          }
      } else {
          setCurrentSelectedObjectProps(null); // No object selected
      }
  }, [selectedObjectId, sceneObjectsData]);

  // Effect to handle TransformControls attachment/detachment AND visual highlighting
  useEffect(() => {
    if (transformControls && liveSceneObjects && scene) {
      liveSceneObjects.forEach(obj => {
        if (obj.userData.id === selectedObjectId) {
          // Highlight selected object
          if (obj.material && obj.userData.originalColor !== undefined) {
            obj.material.color.set(getLighterColor(obj.userData.originalColor));
          } else if (obj.isLight && obj.userData.originalColor !== undefined) {
            obj.color.set(getLighterColor(obj.userData.originalColor));
          }
          transformControls.attach(obj);
        } else {
          // Revert unselected objects to original color
          if (obj.material && obj.userData.originalColor !== undefined) {
            obj.material.color.set(obj.userData.originalColor);
          } else if (obj.isLight && obj.userData.originalColor !== undefined) {
            obj.color.set(obj.userData.originalColor);
          }
        }
      });

      // If no object is selected, ensure transform controls are detached
      if (!selectedObjectId) {
        transformControls.detach();
      }
    }
  }, [selectedObjectId, transformControls, liveSceneObjects, scene, getLighterColor]); // Added getLighterColor to dependencies


  // Effect to synchronize the Three.js scene with the object data whenever sceneObjectsData changes
  useEffect(() => {
    syncSceneWithData();
  }, [sceneObjectsData, syncSceneWithData]);

  // Effect to update the history when sceneObjectsData changes
  useEffect(() => {
    // Only update history if the change came from an action (add/remove/move),
    // not from undo/redo which directly sets sceneObjectsData from history.
    // This is a simple heuristic; a more robust solution might pass an 'action' flag.
    if (sceneObjectsData !== sceneHistory[currentHistoryIndex]) {
      updateHistory(sceneObjectsData);
    }
  }, [sceneObjectsData]); // Dependencies for history update

  // Function to update the history stack
  const updateHistory = useCallback((newObjectsState) => {
    // Discard any redo states if a new action is performed
    const newHistory = sceneHistory.slice(0, currentHistoryIndex + 1);
    newHistory.push(newObjectsState);
    setSceneHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  }, [sceneHistory, currentHistoryIndex]);

  // Main animation loop
  const animate = useCallback(() => {
    requestAnimationFrame(animate);

    if (controls) {
      // Only update OrbitControls if camera motion is enabled
      if (isCameraMotionEnabled) {
        controls.update();
      }
      if (controls.autoRotate !== isAutoRotating) {
        setIsAutoRotating(controls.autoRotate);
      }
    }

    if (transformControls) {
        transformControls.update(); // Update TransformControls in the animation loop
    }

    if (camera && renderer && scene) {
      renderer.render(scene, camera);
    }
  }, [controls, camera, scene, isAutoRotating, renderer, transformControls, isCameraMotionEnabled]);

  useEffect(() => {
    if (renderer && scene && camera) {
      animate();
    }
  }, [renderer, scene, camera, animate]);


  const handleToggleGrid = () => {
    if (gridHelper && centerGridLines) {
      setIsGridVisible((prev) => {
        gridHelper.visible = !prev;
        centerGridLines.visible = !prev;
        return !prev;
      });
    }
  };

  const handleBackgroundColorChange = (event) => {
    const newColor = event.target.value;
    setBackgroundColor(newColor);
    if (scene) {
      scene.background = new THREE.Color(newColor);
    }
  };

  const handleToggleAutoRotate = () => {
    if (controls) {
      controls.autoRotate = !controls.autoRotate;
      setIsAutoRotating(controls.autoRotate);
      // If auto-rotate is turned on, ensure camera motion is enabled
      if (controls.autoRotate && !isCameraMotionEnabled) {
        setIsCameraMotionEnabled(true);
        controls.enabled = true;
      }
    }
  };

  // Handler for position input changes (for NEW objects)
  const handlePositionInputChange = (axis, value) => {
    setPositionInputs(prev => ({
      ...prev,
      [axis]: parseFloat(value) || 0 // Parse to float, default to 0 if invalid
    }));
  };

  // Handler for changing selected object's color
  const handleSelectedObjectColorChange = (event) => {
      const newColor = event.target.value;
      if (selectedObjectId) {
          setSceneObjectsData(prevData => {
              const updatedData = prevData.map(obj => {
                  if (obj.id === selectedObjectId) {
                      // Update color in data
                      return { ...obj, color: new THREE.Color(newColor).getHex() };
                  }
                  return obj;
              });
              return updatedData;
          });

          // Update live object color for immediate feedback
          const selectedObject = liveSceneObjects.find(obj => obj.userData.id === selectedObjectId);
          if (selectedObject) {
            if (selectedObject.material) { // For meshes
                selectedObject.material.color.set(newColor);
                selectedObject.userData.originalColor = new THREE.Color(newColor).getHex(); // Update original color
            } else if (selectedObject.isLight) { // For lights
                selectedObject.color.set(newColor);
                selectedObject.userData.originalColor = new THREE.Color(newColor).getHex(); // Update original color
            }
          }
      }
  };

  // Handler for changing selected object's scale
  const handleSelectedObjectScaleChange = (axis, value) => {
      const newScaleValue = parseFloat(value) || 0;
      if (selectedObjectId) {
          setSceneObjectsData(prevData => {
              const updatedData = prevData.map(obj => {
                  if (obj.id === selectedObjectId) {
                      const newScale = obj.scale.clone();
                      newScale[axis] = newScaleValue;
                      // Update scale in data
                      return { ...obj, scale: newScale };
                  }
                  return obj;
              });
              return updatedData;
          });

          // Update live object scale for immediate feedback
          const selectedObject = liveSceneObjects.find(obj => obj.userData.id === selectedObjectId);
          if (selectedObject && selectedObject.isMesh) { // Only apply to meshes
              selectedObject.scale[axis] = newScaleValue;
              // Detach and re-attach transform controls to refresh handles
              if (transformControls && transformControls.object === selectedObject) {
                  transformControls.detach();
                  transformControls.attach(selectedObject);
              }
          }
      }
  };

  // Handler for changing selected light's intensity
  const handleSelectedObjectIntensityChange = (event) => {
      const newIntensity = parseFloat(event.target.value) || 0;
      if (selectedObjectId) {
          setSceneObjectsData(prevData => {
              const updatedData = prevData.map(obj => {
                  if (obj.id === selectedObjectId && obj.type === 'pointLight') { // Only for point lights
                      return { ...obj, intensity: newIntensity };
                  }
                  return obj;
              });
              return updatedData;
          });

          const selectedLight = liveSceneObjects.find(obj => obj.userData.id === selectedObjectId);
          if (selectedLight && selectedLight.isLight) {
              selectedLight.intensity = newIntensity;
          }
      }
  };


  // Helper function to add a shape data to the state and update history
  const addShapeData = (type, geometry) => {
    const newId = THREE.MathUtils.generateUUID(); // Unique ID for the object
    const color = Math.random() * 0xffffff;

    let yPosition = positionInputs.y;
    // If Y input is 0 or not explicitly set, calculate a default based on geometry
    if (yPosition === 0) {
      if (geometry.parameters.height) { // For Box, Cylinder, Cone
        yPosition = geometry.parameters.height / 2;
      } else if (geometry.parameters.radius) { // For Sphere, Torus
        yPosition = geometry.parameters.radius;
      } else {
        yPosition = 1; // Fallback default
      }
    }

    const newObjectData = {
      id: newId,
      type: type,
      position: new THREE.Vector3(positionInputs.x, yPosition, positionInputs.z),
      rotation: new THREE.Vector3(0, 0, 0), // Initial rotation
      scale: new THREE.Vector3(1, 1, 1),   // Initial scale
      color: color
    };

    const newSceneObjects = [...sceneObjectsData, newObjectData];
    setSceneObjectsData(newSceneObjects);
    // updateHistory will be called by the useEffect watching sceneObjectsData
    console.log(`Added a new ${type} to the scene!`);
  };

  // Handlers for adding different shapes (now call addShapeData)
  const handleAddBox = () => {
    addShapeData('box', new THREE.BoxGeometry(2, 2, 2));
  };

  const handleAddSphere = () => {
    addShapeData('sphere', new THREE.SphereGeometry(1.5, 32, 32));
  };

  const handleAddCylinder = () => {
    addShapeData('cylinder', new THREE.CylinderGeometry(1, 1, 3, 32));
  };

  const handleAddCone = () => {
    addShapeData('cone', new THREE.ConeGeometry(1.5, 3, 32));
  };

  const handleAddTorus = () => {
    addShapeData('torus', new THREE.TorusGeometry(2, 0.5, 16, 100));
  };

  // Handler for adding a Point Light
  const handleAddPointLight = () => {
    const newId = THREE.MathUtils.generateUUID();
    const color = 0xffffff; // Default white light
    const intensity = 1.0; // Default intensity

    let yPosition = positionInputs.y;
    if (yPosition === 0) {
      yPosition = 5; // Default light height
    }

    const newObjectData = {
      id: newId,
      type: 'pointLight',
      position: new THREE.Vector3(positionInputs.x, yPosition, positionInputs.z),
      rotation: new THREE.Vector3(0, 0, 0), // Lights don't typically have rotation in this context
      scale: new THREE.Vector3(1, 1, 1),   // Scale doesn't apply to lights
      color: color,
      intensity: intensity
    };

    const newSceneObjects = [...sceneObjectsData, newObjectData];
    setSceneObjectsData(newSceneObjects);
    console.log('Added a new Point Light to the scene!');
  };


  // Handler for removing the last added object from the scene and updating history
  const handleRemoveObject = () => {
    if (sceneObjectsData.length > 0) {
      const newSceneObjects = sceneObjectsData.slice(0, -1);
      setSceneObjectsData(newSceneObjects);
      setSelectedObjectId(null); // Deselect any object if the last one was removed
      console.log('Removed an object from the scene!');
    } else {
      console.log('No objects to remove.');
    }
  };

  // Handler for removing the SELECTED object from the scene and updating history
  const handleRemoveSelectedObject = () => {
    if (selectedObjectId) {
      const newSceneObjects = sceneObjectsData.filter(obj => obj.id !== selectedObjectId);
      setSceneObjectsData(newSceneObjects);
      setSelectedObjectId(null); // Deselect the object after removal
      console.log(`Removed selected object with ID: ${selectedObjectId}`);
    } else {
      console.log('No object selected to remove.');
    }
  };

  // Undo functionality
  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      setSceneObjectsData(sceneHistory[newIndex]); // Set data directly from history
      setSelectedObjectId(null); // Deselect on undo
      console.log('Undo action triggered!');
    } else {
      console.log('Nothing to undo.');
    }
  };

  // Redo functionality
  const handleRedo = () => {
    if (currentHistoryIndex < sceneHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      setSceneObjectsData(sceneHistory[newIndex]); // Set data directly from history
      setSelectedObjectId(null); // Deselect on redo
      console.log('Redo action triggered!');
    } else {
      console.log('Nothing to redo.');
    }
  };

  // Function to reset the entire scene
  const handleResetScene = () => {
    setSceneObjectsData([]); // Clear all objects
    setSelectedObjectId(null); // Deselect any active object
    setSceneHistory([[]]); // Reset history
    setCurrentHistoryIndex(0); // Reset history index
    console.log('Scene reset to initial state!');
  };

  // Placeholder for import 3D object functionality
  const handleImport3DObject = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected 3D object file:', file.name);
    }
  };

  // Import image functionality
  const handleImportImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          const newId = THREE.MathUtils.generateUUID();

          let yPosition = positionInputs.y;
          // If Y input is 0 or not explicitly set, use a small default for image planes
          if (yPosition === 0) {
            yPosition = 0.05;
          }

          const newObjectData = {
            id: newId,
            type: 'imagePlane',
            position: new THREE.Vector3(positionInputs.x, yPosition, positionInputs.z),
            rotation: new THREE.Vector3(-Math.PI / 2, 0, 0), // Face upwards
            scale: new THREE.Vector3(1, 1, 1),
            imageUrl: dataUrl,
            aspectRatio: aspectRatio,
          };
          setSceneObjectsData(prev => [...prev, newObjectData]);
          console.log('Image imported and added to scene data!');
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-inter">
      <SceneControls
        positionInputs={positionInputs}
        handlePositionInputChange={handlePositionInputChange}
        handleAddBox={handleAddBox}
        handleAddSphere={handleAddSphere}
        handleAddCylinder={handleAddCylinder}
        handleAddCone={handleAddCone}
        handleAddTorus={handleAddTorus}
        handleAddPointLight={handleAddPointLight}
        handleRemoveObject={handleRemoveObject}
        handleRemoveSelectedObject={handleRemoveSelectedObject}
        selectedObjectId={selectedObjectId}
        currentSelectedObjectProps={currentSelectedObjectProps}
        handleSelectedObjectColorChange={handleSelectedObjectColorChange}
        handleSelectedObjectScaleChange={handleSelectedObjectScaleChange}
        handleSelectedObjectIntensityChange={handleSelectedObjectIntensityChange}
        handleImport3DObject={handleImport3DObject}
        handleImportImage={handleImportImage}
        handleToggleGrid={handleToggleGrid}
        isGridVisible={isGridVisible}
        handleUndo={handleUndo}
        canUndo={currentHistoryIndex > 0}
        handleRedo={handleRedo}
        canRedo={currentHistoryIndex < sceneHistory.length - 1}
        handleResetScene={handleResetScene}
        hasObjectsInScene={sceneObjectsData.length > 0}
        backgroundColor={backgroundColor}
        handleBackgroundColorChange={handleBackgroundColorChange}
        handleToggleAutoRotate={handleToggleAutoRotate}
        isAutoRotating={isAutoRotating}
        isCameraMotionEnabled={isCameraMotionEnabled}
      />

      {/* 3D Scene Container */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div
          ref={mountRef}
          className="w-full h-full bg-white overflow-hidden"
          style={{ minHeight: '400px' }}
        >
          {/* Three.js canvas will be appended here */}
        </div>
      </main>
    </div>
  );
};

export default App;
