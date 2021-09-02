/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import {
  auth, admin, police, fire, civilian, dispatch, emptyDepartment,
} from './middlewares';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue'), meta: { middlwares: [emptyDepartment] } },
      { path: 'home', component: () => import('pages/Home.vue'), meta: { middlewares: [auth, emptyDepartment] } },
      { path: 'civilian', component: () => import('pages/Civilian.vue'), meta: { middlewares: [auth, civilian] } },
      { path: 'dispatch', component: () => import('pages/Dispatch.vue'), meta: { middlewares: [auth, dispatch] } },
      { path: 'fire', component: () => import('pages/Fire.vue'), meta: { middlewares: [auth, fire] } },
      { path: 'police', component: () => import('pages/Police.vue'), meta: { middlewares: [auth, police] } },

      { path: 'admin', component: () => import('pages/Admin.vue'), meta: { middlewares: [auth, admin] } },

      { path: 'error', component: () => import('pages/Error.vue'), meta: { middlewares: [emptyDepartment] } },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
    meta: { middlewares: [emptyDepartment] },
  },
];

export default routes;
