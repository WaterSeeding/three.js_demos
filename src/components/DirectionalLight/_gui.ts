import * as THREE from 'three';
import { DirectionalLightParamsInterface } from './_typings';
import { setGuiSlide } from './utils/setGuiSlide';
import { setGuiCheckbox } from './utils/setGuiCheckbox';

const reviseGui = (
  directionalLight: THREE.DirectionalLight,
  guiParams: DirectionalLightParamsInterface,
) => {
  directionalLight.visible = guiParams.visible;
  directionalLight.intensity = guiParams.intensity;
  directionalLight.color.setRGB(
    guiParams.color[0] / 255,
    guiParams.color[1] / 255,
    guiParams.color[2] / 255,
  );
  directionalLight.position.set(
    guiParams.position.x,
    guiParams.position.y,
    guiParams.position.z,
  );
};

const storeGui = (
  guiParams: DirectionalLightParamsInterface,
  storeCb: (data: DirectionalLightParamsInterface) => void,
) => {
  storeCb({
    visible: guiParams.visible,
    intensity: guiParams.intensity,
    color: guiParams.color,
    position: guiParams.position,
  });
};

export const setGui = (
  gui: dat.GUI,
  guiParams: DirectionalLightParamsInterface,
  scene: THREE.Scene,
  directionalLight: THREE.DirectionalLight,
  storeCb?: (data: DirectionalLightParamsInterface) => void,
) => {
  let initGuiParams: DirectionalLightParamsInterface,
    downloadGuiParams: DirectionalLightParamsInterface;
  let directionalLight_folder = gui.addFolder('DirectionalLight');
  directionalLight_folder.close();

  initGuiParams = Object.assign({}, guiParams);
  downloadGuiParams = Object.assign({}, guiParams);
  reviseGui(directionalLight, initGuiParams);

  const directionalLightHelper = new THREE.CameraHelper(
    directionalLight.shadow.camera,
  );
  directionalLightHelper.visible = false
  scene.add(directionalLightHelper);

  setGuiCheckbox(
    directionalLight_folder,
    {
      helper: false,
    },
    'helper',
    'helper',
    (v) => {
      directionalLightHelper.visible = v;
    },
  );

  setGuiCheckbox(
    directionalLight_folder,
    guiParams,
    'visible',
    'visible',
    () => {
      reviseGui(directionalLight, guiParams);
    },
  );

  setGuiSlide(
    directionalLight_folder,
    guiParams,
    'intensity',
    'intensity',
    {
      min: 0,
      max: 5,
      step: 0.000001,
    },
    () => {
      reviseGui(directionalLight, guiParams);
    },
  );

  directionalLight_folder.addColor(guiParams, 'color').onChange(() => {
    reviseGui(directionalLight, guiParams);
  });

  setGuiSlide(
    directionalLight_folder,
    guiParams.position,
    'x',
    'position.x',
    {
      min: -1000,
      max: 1000,
      step: 1,
    },
    () => {
      reviseGui(directionalLight, guiParams);
      directionalLightHelper.update();
    },
  );

  setGuiSlide(
    directionalLight_folder,
    guiParams.position,
    'y',
    'position.y',
    {
      min: -1000,
      max: 1000,
      step: 1,
    },
    () => {
      reviseGui(directionalLight, guiParams);
      directionalLightHelper.update();
    },
  );

  setGuiSlide(
    directionalLight_folder,
    guiParams.position,
    'z',
    'position.z',
    {
      min: -1000,
      max: 1000,
      step: 1,
    },
    () => {
      reviseGui(directionalLight, guiParams);
      directionalLightHelper.update();
    },
  );

  let obj = {
    ensure: () => {
      storeGui(guiParams, storeCb!);
      downloadGuiParams = Object.assign({}, guiParams);
    },
    reset: () => {
      reviseGui(directionalLight, initGuiParams);
      storeGui(initGuiParams, storeCb!);
      directionalLight_folder.revert(directionalLight_folder);
      downloadGuiParams = Object.assign({}, initGuiParams);
    },
  };

  directionalLight_folder.add(obj, 'ensure').name('确定参数');
  directionalLight_folder.add(obj, 'reset').name('重置参数');

  return directionalLight_folder;
};
