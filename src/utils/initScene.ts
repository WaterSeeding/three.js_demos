import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { addSkyBox } from './addSkyBox';
import { addComposer } from './addComposer';
import { getCubeMapTexture } from './getCubeMapTexture';

export const initScene = (cb?: Function, updateCb?: Function): void => {
  const BLOOM_SCENE = 1;
  const bloomLayer = new THREE.Layers();
  bloomLayer.set(BLOOM_SCENE);

  const stats = new Stats();
  document.body.appendChild(stats.dom);

  const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl')!,
    antialias: true,
  });
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.LinearToneMapping;

  const scene = new THREE.Scene();
  const axesHelper = new THREE.AxesHelper(500);
  scene.add(axesHelper);

  const frustumSize = 45;
  const aspect = window.innerWidth / window.innerHeight;
  const camera = new THREE.PerspectiveCamera(frustumSize, aspect, 1, 10000);
  camera.position.set(0, 0, 500 / 10);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  const earth = new THREE.Group();
  let controls: null | OrbitControls = null;
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enabled = true;
  controls.autoRotate = false;
  controls.enableDamping = true;
  controls.enableRotate = true;
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.maxPolarAngle = 1.5;

  window.addEventListener(
    'resize',
    () => {
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    },
    false,
  );

  addSkyBox(scene);

  getCubeMapTexture(renderer, './earths/hdr/DS360_Volume_2_bonus_Ref.hdr').then(
    (envMap: THREE.Texture | any) => {
      scene.environment = envMap;
      // scene.background = envMap;
      renderer.toneMappingExposure = 1.12;
    },
  );

  const composer = addComposer(renderer, scene, camera, canvas);

  const textLoader = new THREE.TextureLoader();
  let planetMap = textLoader.load('./earths/img/earth_atmos_4096.jpg');
  let planetNormalMap = textLoader.load('./earths/img/earth_normal.jpeg');
  let planetRoughnessMap = textLoader.load('./earths/img/earth_rough.jpeg');
  const planet = new THREE.Mesh(
    new THREE.PlaneGeometry(2048 / 10, 1024 / 10),
    new THREE.MeshStandardMaterial({
      side: THREE.FrontSide,
      map: planetMap,
      normalMap: planetNormalMap,
      roughnessMap: planetRoughnessMap,
      normalScale: new THREE.Vector2(10, 10),
      metalness: 0.1,
    }),
  );
  earth.add(planet);
  earth.rotateX(-Math.PI / 2);
  earth.position.setY(-15);
  scene.add(earth);

  const animate = () => {
    requestAnimationFrame(animate);
    TWEEN && TWEEN.update();
    controls?.update();
    updateCb?.();

    renderer.autoClear = false;
    renderer.clear();
    if (composer) {
      composer.render();
    }
    renderer.clearDepth();
    stats.update();
    renderer.render(scene, camera);
  };
  animate();

  cb?.({
    scene,
    earth,
    camera,
    controls,
  });
};
