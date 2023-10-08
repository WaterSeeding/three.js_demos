import * as THREE from 'three';
import * as dat from 'dat.gui';
import { DirectionalLightParamsInterface } from './_typings';
import { directionalLightTable } from './_db';
import { setParams } from './_params';
import { setGui } from './_gui';

class DirectionalLight {
  directionalLight!: THREE.DirectionalLight;
  directionalLightParams!: DirectionalLightParamsInterface;
  constructor(
    scene: THREE.Scene,
    gui: dat.GUI,
    directionalLightParams?: DirectionalLightParamsInterface,
    hideGui?: boolean,
  ) {
    setParams(directionalLightTable).then(
      (storeDirectionalLightParams: DirectionalLightParamsInterface) => {
        // console.log("storeDirectionalLightParams", storeDirectionalLightParams);
        this.directionalLightParams =
          directionalLightParams || storeDirectionalLightParams;
        this.init(scene, this.directionalLightParams);
        let directionalLightGui = setGui(
          gui,
          this.directionalLightParams,
          scene,
          this.directionalLight,
          (data: DirectionalLightParamsInterface) => {
            directionalLightTable.add(data);
          },
        );
        if (hideGui) {
          directionalLightGui.hide();
        }
      },
    );
  }

  init(scene: THREE.Scene, params: DirectionalLightParamsInterface) {
    let color = new THREE.Color(
      `rgb(${params.color[0]}, ${params.color[1]}, ${params.color[2]})`,
    );
    let light = new THREE.DirectionalLight(color, 1.5);
    light.intensity = params.intensity;
    light.position.set(params.position.x, params.position.y, params.position.z);
    light.castShadow = true;
    scene.add(light);

    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;
    light.shadow.camera.right = 150 ;
    light.shadow.camera.left = -150 ;
    light.shadow.camera.top = 150;
    light.shadow.camera.bottom = -150;
    light.shadow.mapSize.width = 512 * 2;
    light.shadow.mapSize.height = 512 * 2;

    this.directionalLight = light;
  }
}

export default DirectionalLight;
