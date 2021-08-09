/* eslint-disable eqeqeq */
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';

import middlewarePipeline from './middleware-pipeline';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */ { store }) {
  const createHistory = process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    store.commit('windows/clearAll');
    if (store.state.auth.initialized == false) {
      await new Promise((resolve) => {
        const unwatch = store.watch((state) => state.auth.initialized, () => {
          unwatch();
          resolve();
        });
      });
    }

    next();
  });

  Router.beforeEach((to, from, next) => {
    if (!to.meta.middlewares) return next();
    if (to.meta.middlewares.length === 0) return next();
    const { middlewares } = to.meta;
    const context = {
      to, from, next, store,
    };
    return middlewares[0]({
      ...context,
      next: middlewarePipeline(context, middlewares, 1),
    });
  });

  return Router;
}
