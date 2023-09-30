import * as THREE from 'three';

export const addSkyBox = (scene: THREE.Scene) => {
  const path = './earths/sun/';
  const urls = [
    path + 'px.jpg',
    path + 'nx.jpg',
    path + 'py.jpg',
    path + 'ny.jpg',
    path + 'pz.jpg',
    path + 'nz.jpg',
  ];

  const loader = new THREE.TextureLoader();

  const materialArray = [];
  for (let i = 0; i < 6; i++)
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: loader.load(urls[i]),
        side: THREE.BackSide,
      }),
    );

  const skyGeometry = new THREE.BoxGeometry(2048 / 10, 2048 / 10, 2048 / 10);
  const skyBox = new THREE.Mesh(skyGeometry, materialArray);
  skyBox.rotateY(-Math.PI / 2);
  scene.add(skyBox);
};
