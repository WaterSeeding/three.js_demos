import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export const getCubeMapTexture = (
  renderer: THREE.WebGLRenderer,
  path: string,
) => {
  return new Promise((resolve, reject) => {
    new RGBELoader().load(
      path,
      (texture: any) => {
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();

        resolve(envMap);
      },
      undefined,
      reject,
    );
  });
};
