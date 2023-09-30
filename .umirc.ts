import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/demo',
    },
    {
      name: 'DEMO 示例',
      path: '/demo',
      component: './Demo',
      layout: false,
    },
    {
      name: 'Webgl_Instancing_Dynamic 示例',
      path: '/Webgl_Instancing_Dynamic',
      component: './1_Webgl_Instancing_Dynamic',
      layout: false,
    }
  ],
  npmClient: 'pnpm',
});
