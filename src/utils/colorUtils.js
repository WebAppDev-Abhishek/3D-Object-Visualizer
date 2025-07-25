import * as THREE from 'three';

/**
 * Returns a lighter version of a given hexadecimal color.
 * @param {number} hexColor - The original color in hexadecimal format (e.g., 0xff0000).
 * @returns {THREE.Color} A new THREE.Color object representing the lighter color.
 */
export const getLighterColor = (hexColor) => {
  const color = new THREE.Color(hexColor);
  // Increase lightness by a factor, ensuring it doesn't go above 1.0
  // You can adjust the 0.2 value for more or less lightness
  color.offsetHSL(0, 0, 0.2);
  return color;
};
