import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'AI',
    component: () => import('@/views/chat/index.vue'),
    meta: {
      title: '数智网格员',
    },
  },
  // {
  //   path: '/',
  //   name: 'AI',
  //   component: () => import('@/views/aicopy/index.vue'),
  //   meta: {
  //     title: '数智网格员',
  //   },
  // }
];

const router = createRouter({
  history: createWebHashHistory(`/${process.env.PROD_PREFIX}`),
  routes,
});

export default router;
