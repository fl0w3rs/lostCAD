import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { middlewarePipeline, MiddlewareFunction } from './middlewares/_main';
import { StateInterface } from '../store';
import routes from './routes';

declare module 'vue-router' {
  interface RouteMeta {
    middlewares?: Array<MiddlewareFunction>
  }
}

export default route<StateInterface>(({ store }) => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE,
    ),
  });

  Router.beforeEach((to, from, next) => {
    if (!to.meta.middlewares) return next();
    if (to.meta.middlewares.length === 0) return next();
    // eslint-disable-next-line prefer-destructuring
    const middlewares: Array<MiddlewareFunction> = to.meta.middlewares;
    const context = {
      to, from, next, store,
    };
    return middlewares[0]({
      ...context,
      next: middlewarePipeline(context, middlewares, 1),
    });
  });

  return Router;
});
