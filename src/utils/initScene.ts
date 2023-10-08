import * as THREE from 'three';
import * as dat from 'dat.gui';
import TWEEN from '@tweenjs/tween.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { addSkyBox } from './addSkyBox';
import { addComposer } from './addComposer';
import { getCubeMapTexture } from './getCubeMapTexture';

export const initScene = (
  gui: dat.GUI,
  cb?: Function,
  updateCb?: Function,
): void => {
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
  // 如果设置开启，允许在场景中使用阴影映射的设置
  // 阴影映射是一种计算机图形技术，用于在渲染过程中模拟光线与物体之间的阴影效果。
  // 启用阴影映射后，WebGL渲染器将能够生成并显示投射在场景中的物体上的阴影。
  // 通过将renderer.shadowMap.enabled设置为true，您告诉WebGL渲染器启用阴影映射功能。
  // 这意味着渲染器将会计算光源和物体之间的阴影，并将其正确地渲染到场景中。
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  const axesHelper = new THREE.AxesHelper(500);
  scene.add(axesHelper);

  const frustumSize = 45;
  const aspect = window.innerWidth / window.innerHeight;
  const camera = new THREE.PerspectiveCamera(frustumSize, aspect, 1, 10000);
  camera.position.set(0, 10, 50);
  // camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  const earth = new THREE.Group();
  let controls: null | OrbitControls = null;
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.enableZoom = true;
  controls.enableRotate = true;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.75;

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
    updateCb?.();

    renderer.autoClear = false;
    renderer.clear();
    if (composer) {
      composer.render();
    }
    renderer.clearDepth();
    stats.update();
    // controls?.update();
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
