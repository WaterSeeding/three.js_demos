import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export const addComposer = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  canvas: HTMLCanvasElement,
) => {
  let renderScene = new RenderPass(scene, camera);
  let effectFXAA = new ShaderPass(FXAAShader);
  effectFXAA.uniforms.resolution.value.set(
    1 / canvas.offsetWidth,
    1 / canvas.offsetHeight,
  );

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(canvas.offsetWidth, canvas.offsetHeight),
    1.0,
    0.0,
    0.0,
  );
  bloomPass.strength = 1.0;
  bloomPass.radius = 0.0;
  bloomPass.threshold = 0.0;

  const renderTarget = new THREE.WebGLRenderTarget(
    canvas.offsetWidth,
    canvas.offsetHeight,
  );
  let composer = new EffectComposer(renderer, renderTarget);

  composer.addPass(renderScene);
  composer.addPass(effectFXAA);
  composer.addPass(bloomPass);
  return composer;
};
