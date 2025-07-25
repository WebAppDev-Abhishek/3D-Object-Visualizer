import React from 'react';

/**
 * SceneControls component for managing UI interactions in the 3D scene.
 * @param {object} props - Component props.
 * @param {object} props.positionInputs - Current X, Y, Z for new object position.
 * @param {function} props.handlePositionInputChange - Handler for position input changes.
 * @param {function} props.handleAddBox - Handler to add a box.
 * @param {function} props.handleAddSphere - Handler to add a sphere.
 * @param {function} props.handleAddCylinder - Handler to add a cylinder.
 * @param {function} props.handleAddCone - Handler to add a cone.
 * @param {function} props.handleAddTorus - Handler to add a torus.
 * @param {function} props.handleAddPointLight - Handler to add a point light.
 * @param {function} props.handleRemoveObject - Handler to remove the last object.
 * @param {function} props.handleRemoveSelectedObject - Handler to remove the selected object.
 * @param {string | null} props.selectedObjectId - ID of the currently selected object.
 * @param {object | null} props.currentSelectedObjectProps - Properties of the selected object.
 * @param {function} props.handleSelectedObjectColorChange - Handler for selected object color change.
 * @param {function} props.handleSelectedObjectScaleChange - Handler for selected object scale change.
 * @param {function} props.handleSelectedObjectIntensityChange - Handler for selected light intensity change.
 * @param {function} props.handleImport3DObject - Handler for importing 3D models.
 * @param {function} props.handleImportImage - Handler for importing images.
 * @param {function} props.handleToggleGrid - Handler to toggle grid visibility.
 * @param {boolean} props.isGridVisible - State of grid visibility.
 * @param {function} props.handleUndo - Handler for undo action.
 * @param {boolean} props.canUndo - Whether undo is possible.
 * @param {function} props.handleRedo - Handler for redo action.
 * @param {boolean} props.canRedo - Whether redo is possible.
 * @param {function} props.handleResetScene - Handler to reset the scene.
 * @param {boolean} props.hasObjectsInScene - Whether there are objects in the scene.
 * @param {string} props.backgroundColor - Current background color.
 * @param {function} props.handleBackgroundColorChange - Handler for background color change.
 * @param {function} props.handleToggleAutoRotate - Handler to toggle auto-rotation.
 * @param {boolean} props.isAutoRotating - State of auto-rotation.
 * @param {boolean} props.isCameraMotionEnabled - State of camera motion.
 */
const SceneControls = ({
  positionInputs,
  handlePositionInputChange,
  handleAddBox,
  handleAddSphere,
  handleAddCylinder,
  handleAddCone,
  handleAddTorus,
  handleAddPointLight,
  handleRemoveObject,
  handleRemoveSelectedObject,
  selectedObjectId,
  currentSelectedObjectProps,
  handleSelectedObjectColorChange,
  handleSelectedObjectScaleChange,
  handleSelectedObjectIntensityChange,
  handleImport3DObject,
  handleImportImage,
  handleToggleGrid,
  isGridVisible,
  handleUndo,
  canUndo,
  handleRedo,
  canRedo,
  handleResetScene,
  hasObjectsInScene,
  backgroundColor,
  handleBackgroundColorChange,
  handleToggleAutoRotate,
  isAutoRotating,
  isCameraMotionEnabled,
}) => {
  return (
    <header className="bg-transparent text-white p-1 shadow-lg rounded-b-lg">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-1 md:gap-2">
        <h1 className="text-lg font-bold tracking-tight">3D Scene Explorer</h1>
        <div className="flex flex-wrap items-center gap-1 md:gap-2">
          {/* Position Inputs for NEW objects */}
          <div className="flex items-center gap-1 bg-white text-gray-800 px-2 py-1 rounded-md shadow-sm">
            <label htmlFor="posX" className="font-semibold text-xs">New X:</label>
            <input
              type="number"
              id="posX"
              value={positionInputs.x}
              onChange={(e) => handlePositionInputChange('x', e.target.value)}
              className="w-12 text-xs rounded-sm border border-gray-300 px-1 py-0.5"
              step="0.5"
            />
            <label htmlFor="posY" className="font-semibold text-xs">New Y:</label>
            <input
              type="number"
              id="posY"
              value={positionInputs.y}
              onChange={(e) => handlePositionInputChange('y', e.target.value)}
              className="w-12 text-xs rounded-sm border border-gray-300 px-1 py-0.5"
              step="0.5"
            />
            <label htmlFor="posZ" className="font-semibold text-xs">New Z:</label>
            <input
              type="number"
              id="posZ"
              value={positionInputs.z}
              onChange={(e) => handlePositionInputChange('z', e.target.value)}
              className="w-12 text-xs rounded-sm border border-gray-300 px-1 py-0.5"
              step="0.5"
            />
          </div>

          {/* Add Shape Buttons */}
          <button
            onClick={handleAddBox}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
          >
            <svg className="w-3 h-3 inline-block mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-1 1v2H5a1 1 0 000 2h3v3a1 1 0 002 0V7h3a1 1 0 100-2h-3V3a1 1 0 00-1-1z" clipRule="evenodd"></path><path fillRule="evenodd" d="M4 8a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V8zm2 2a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
            Add Box
          </button>
          <button
            onClick={handleAddSphere}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
          >
            <svg className="w-3 h-3 inline-block mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd"></path></svg>
            Add Sphere
          </button>
          <button
            onClick={handleAddCylinder}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
          >
            <svg className="w-3 h-3 inline-block mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6 10a4 4 0 118 0H6z" clipRule="evenodd"></path></svg>
            Add Cylinder
          </button>
          <button
            onClick={handleAddCone}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
          >
            <svg className="w-3 h-3 inline-block mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM10 2a.75.75 0 01.75.75v6.5a.75.75 0 01-1.5 0v-6.5A.75.75 0 0110 2z" clipRule="evenodd"></path></svg>
            Add Cone
          </button>
          <button
            onClick={handleAddTorus}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
          >
            <svg className="w-3 h-3 inline-block mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM10 4a6 6 0 100 12 6 6 0 000-12zm0 2a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd"></path></svg>
            Add Torus
          </button>
          <button
            onClick={handleAddPointLight}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
          >
            <svg className="w-3 h-3 inline-block mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM10 4a6 6 0 100 12 6 6 0 000-12zm0 2a4 4 0 100 8 4 4 0 000-8zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
            Add Point Light
          </button>


          {/* Remove Object Button */}
          <button
            onClick={handleRemoveObject}
            className={`px-2 py-1 font-semibold rounded-md shadow-sm transition-all duration-200 text-xs ${
              hasObjectsInScene ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-500 cursor-not-allowed'
            } text-white`}
            disabled={!hasObjectsInScene}
          >
            <svg className="w-3 h-3 inline-block mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 01-2 0v6a1 1 0 112 0V8z" clipRule="evenodd"></path></svg>
            Remove Last
          </button>

          {/* Remove Selected Object Button */}
          <button
            onClick={handleRemoveSelectedObject}
            className={`px-2 py-1 font-semibold rounded-md shadow-sm transition-all duration-200 text-xs ${
              selectedObjectId ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-500 cursor-not-allowed'
            } text-white`}
            disabled={!selectedObjectId}
          >
            <svg className="w-3 h-3 inline-block mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 01-2 0v6a1 1 0 112 0V8z" clipRule="evenodd"></path></svg>
            Remove Selected
          </button>

          {/* Conditional UI for Selected Object */}
          {currentSelectedObjectProps && (
              <div className="flex items-center gap-1 bg-white text-gray-800 px-2 py-1 rounded-md shadow-sm">
                  <span className="font-semibold text-xs">Selected:</span>
                  {/* Color Picker for Selected Object */}
                  <label htmlFor="selectedColor" className="font-semibold text-xs">Color:</label>
                  <input
                      type="color"
                      id="selectedColor"
                      value={`#${currentSelectedObjectProps.color.toString(16).padStart(6, '0')}`} // Convert hex to #RRGGBB
                      onChange={handleSelectedObjectColorChange}
                      className="w-5 h-5 rounded-sm border-none cursor-pointer"
                      title="Change Selected Object Color"
                  />

                  {/* Scale Inputs for Selected Object (only for meshes) */}
                  {currentSelectedObjectProps.type !== 'pointLight' && (
                    <>
                      <label htmlFor="scaleX" className="font-semibold text-xs">Scale X:</label>
                      <input
                          type="number"
                          id="scaleX"
                          value={currentSelectedObjectProps.scale.x.toFixed(2)}
                          onChange={(e) => handleSelectedObjectScaleChange('x', e.target.value)}
                          className="w-12 text-xs rounded-sm border border-gray-300 px-1 py-0.5"
                          step="0.1"
                      />
                      <label htmlFor="scaleY" className="font-semibold text-xs">Y:</label>
                      <input
                          type="number"
                          id="scaleY"
                          value={currentSelectedObjectProps.scale.y.toFixed(2)}
                          onChange={(e) => handleSelectedObjectScaleChange('y', e.target.value)}
                          className="w-12 text-xs rounded-sm border border-gray-300 px-1 py-0.5"
                          step="0.1"
                      />
                      <label htmlFor="scaleZ" className="font-semibold text-xs">Z:</label>
                      <input
                          type="number"
                          id="scaleZ"
                          value={currentSelectedObjectProps.scale.z.toFixed(2)}
                          onChange={(e) => handleSelectedObjectScaleChange('z', e.target.value)}
                          className="w-12 text-xs rounded-sm border border-gray-300 px-1 py-0.5"
                          step="0.1"
                      />
                    </>
                  )}

                  {/* Intensity Input for Selected Light (only for point lights) */}
                  {currentSelectedObjectProps.type === 'pointLight' && (
                    <>
                      <label htmlFor="intensity" className="font-semibold text-xs">Intensity:</label>
                      <input
                          type="number"
                          id="intensity"
                          value={currentSelectedObjectProps.intensity.toFixed(2)}
                          onChange={handleSelectedObjectIntensityChange}
                          className="w-12 text-xs rounded-sm border border-gray-300 px-1 py-0.5"
                          step="0.1"
                          min="0"
                          max="10"
                      />
                    </>
                  )}
              </div>
          )}


          {/* Import 3D Object Button */}
          <label className="relative inline-flex items-center justify-center px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200 cursor-pointer overflow-hidden">
            <input
              type="file"
              accept=".glb,.gltf,.obj"
              onChange={handleImport3DObject}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            Import 3D Object
          </label>

          {/* Import Image Button */}
          <label className="relative inline-flex items-center justify-center px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200 cursor-pointer overflow-hidden">
            <input
              type="file"
              accept="image/*"
              onChange={handleImportImage}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-4 4 4 4-4V5h-2v5L9 7l-4 4v4z" clipRule="evenodd"></path></svg>
            Import Image
          </label>

          {/* Grid On/Off Button */}
          <button
            onClick={handleToggleGrid}
            className={`px-2 py-1 font-semibold rounded-md shadow-sm transition-all duration-200 text-xs ${
              isGridVisible ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-500 hover:bg-gray-600'
            } text-white`}
          >
            <svg className="w-3 h-3 inline-block mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v10H5V5z" clipRule="evenodd" fillRule="evenodd"></path></svg>
            Grid {isGridVisible ? 'Off' : 'On'}
          </button>

          {/* Undo Button */}
          <button
            onClick={handleUndo}
            className={`px-2 py-1 font-semibold rounded-md shadow-sm transition-all duration-200 text-xs ${
              canUndo ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-500 cursor-not-allowed'
            } text-white`}
            disabled={!canUndo}
          >
            <svg className="w-3 h-3 inline-block mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.782 4.197a.75.75 0 011.06 0l3.25 3.25a.75.75 0 01-1.06 1.06L12 6.06V16.5a.75.75 0 01-1.5 0V6.06l-2.22 2.22a.75.75 0 11-1.06-1.06l3.25-3.25a.75.75 0 010 0z" clipRule="evenodd"></path></svg>
            Undo
          </button>

          {/* Redo Button */}
          <button
            onClick={handleRedo}
            className={`px-2 py-1 font-semibold rounded-md shadow-sm transition-all duration-200 text-xs ${
              canRedo ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-500 cursor-not-allowed'
            } text-white`}
            disabled={!canRedo}
          >
            <svg className="w-3 h-3 inline-block mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.218 4.197a.75.75 0 010 1.06L5.996 7.5l2.222 2.222a.75.75 0 11-1.06 1.06l-3.25-3.25a.75.75 0 010-1.06l3.25-3.25a.75.75 0 011.06 0zM10.5 16.5V6.06l2.22 2.22a.75.75 0 111.06-1.06l-3.25-3.25a.75.75 0 010 0z" clipRule="evenodd"></path></svg>
            Redo
          </button>

          {/* Reset Scene Button */}
          <button
            onClick={handleResetScene}
            className={`px-2 py-1 font-semibold rounded-md shadow-sm transition-all duration-200 text-xs ${
              hasObjectsInScene ? 'bg-red-700 hover:bg-red-800' : 'bg-gray-500 cursor-not-allowed'
            } text-white`}
            disabled={!hasObjectsInScene}
          >
            <svg className="w-3 h-3 inline-block mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-7.414-2.586a.75.75 0 011.06-1.06L10 14.939l6.354-6.353a.75.75 0 011.06 1.06L11.06 16.06a.75.75 0 01-1.06 0L2.586 10.586a.75.75 0 010-1.06z" clipRule="evenodd"></path></svg>
            Reset Scene
          </button>

          {/* Background Color Picker */}
          <div className="flex items-center gap-1 bg-white text-gray-800 px-2 py-1 rounded-md shadow-sm">
            <label htmlFor="bgColor" className="font-semibold text-xs">Background:</label>
            <input
              type="color"
              id="bgColor"
              value={backgroundColor}
              onChange={handleBackgroundColorChange}
              className="w-5 h-5 rounded-sm border-none cursor-pointer"
              title="Change Background Color"
            />
          </div>

          {/* Auto-rotate Button */}
          <button
            onClick={handleToggleAutoRotate}
            className={`px-2 py-1 font-semibold rounded-md shadow-sm transition-all duration-200 text-xs ${
              isAutoRotating ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'
            } text-white`}
          >
            <svg className="w-3 h-3 inline-block mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.852 14.28a.75.75 0 01-.704-1.004l1.25-3.75a.75.75 0 011.404.468l-1.25 3.75a.75.75 0 01-1.004.286zM15.148 5.72a.75.75 0 01.704 1.004l-1.25 3.75a.75.75 0 01-1.404-.468l1.25-3.75a.75.75 0 011.004-.286zM10 2.5a.75.75 0 01.75.75v14.5a.75.75 0 01-1.5 0V3.25A.75.75 0 0110 2z" clipRule="evenodd"></path></svg>
            Auto-rotate {isAutoRotating ? 'Off' : 'On'}
          </button>

          {/* Camera Motion Toggle Indicator */}
          <div className="flex items-center gap-1 bg-white text-gray-800 px-2 py-1 rounded-md shadow-sm">
            <span className="font-semibold text-xs">Motion:</span>
            <span className={`text-xs font-bold ${isCameraMotionEnabled ? 'text-green-600' : 'text-red-600'}`}>
              {isCameraMotionEnabled ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SceneControls;
