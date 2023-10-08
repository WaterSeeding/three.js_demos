import { DirectionalLightParamsInterface } from './_typings';
import { DirectionalLightTableInterface } from './_db';

const defaultParams = {
  visible: true,
  intensity: 1.2,
  color: [232, 227, 116, 1],
  position: {
    x: 113,
    y: 172,
    z: 89,
  },
};

export const setParams = async (
  cameraTable: DirectionalLightTableInterface,
): Promise<DirectionalLightParamsInterface> => {
  let res = await cameraTable.toArray();
  let latestResValue = res[res.length - 1] || {};
  return { ...defaultParams, ...latestResValue };
};
