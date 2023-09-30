import styles from './index.less';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initScene } from '@/utils/initScene';

const Demo = () => {
  let sceneRef = useRef<THREE.Scene | any>(null);
  let earthRef = useRef<THREE.Group | any>(null);
  let cameraRef = useRef<THREE.PerspectiveCamera | any>(null);
  let controlsRef = useRef<OrbitControls | any>(null);
  let instancedMeshRef = useRef<THREE.InstancedMesh | any>(null);
  let dummyRef = useRef<THREE.Object3D | any>(null);

  const [isInitScene, setIsInitScene] = useState<boolean>(false);

  let uniforms = {
    time: { value: 0.0 },
    startTime: { value: 0.0 },
  };

  const amount = parseInt(window.location.search.slice(1)) || 20;
  const count = Math.pow(amount, 3);

  const clock = new THREE.Clock();

  let isStart = true;

  useEffect(() => {
    if (!isInitScene) {
      setIsInitScene(true);
      initScene(
        ({
          scene,
          earth,
          camera,
          controls,
        }: {
          scene: THREE.Scene;
          earth: THREE.Group;
          camera: THREE.PerspectiveCamera;
          controls: OrbitControls;
          light: THREE.DirectionalLight;
          lightHelper: THREE.DirectionalLightHelper;
        }) => {
          sceneRef.current = scene;
          earthRef.current = earth;
          cameraRef.current = camera;
          controlsRef.current = controls;
          dummyRef.current = new THREE.Object3D();

          addMesh(sceneRef.current, count).then((modelMesh) => {
            instancedMeshRef.current = modelMesh;
            let gui = new GUI();
            gui.add(instancedMeshRef.current, 'count', 0, count);

            if (instancedMeshRef.current) {
              let i = 0;
              let offset = (amount - 1) / 2;

              for (let x = 0; x < amount; x++) {
                for (let y = 0; y < amount; y++) {
                  for (let z = 0; z < amount; z++) {
                    dummyRef.current.position.set(
                      offset - x,
                      offset - y,
                      offset - z,
                    );
                    // 更新局部变换
                    dummyRef.current.updateMatrix();
                    instancedMeshRef.current.setMatrixAt(
                      i++,
                      dummyRef.current.matrix,
                    );
                  }
                }
              }

              instancedMeshRef.current.instanceMatrix.needsUpdate = true;
              instancedMeshRef.current.computeBoundingSphere();
            }
          });
        },
        () => {
          const dt = clock.getDelta();
          uniforms['time'].value += dt;
          if (isStart) {
            uniforms['startTime'].value += dt * 0.5;
            if (uniforms['startTime'].value >= 1) {
              uniforms['startTime'].value = 1;
              isStart = false;
            }
          }
        },
      );
    }
  }, []);

  const addMesh = (scene: THREE.Scene, count: number) => {
    return new Promise((resolve, reject) => {
      const loader = new THREE.BufferGeometryLoader();
      loader.load('./models/json/suzanne_buffergeometry.json', (geometry) => {
        geometry.computeVertexNormals();
        geometry.scale(0.5, 0.5, 0.5);

        let material = new THREE.MeshNormalMaterial();
        let mesh = new THREE.InstancedMesh(geometry, material, count);
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        scene.add(mesh);
        resolve(mesh);
      });
    });
  };

  return (
    <div className={styles.container}>
      <canvas
        className="webgl"
        style={{ width: '100%', height: '100%' }}
      ></canvas>
    </div>
  );
};

export default Demo;
