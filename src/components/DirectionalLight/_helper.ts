import * as THREE from 'three';

export const addDirectionalLightHelper = (
  scene: THREE.Scene,
  directionalLight: THREE.DirectionalLight,
): THREE.DirectionalLightHelper => {
  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    50,
  );
  directionalLightHelper.visible = true;
  scene.add(directionalLightHelper);

  return directionalLightHelper;
};
