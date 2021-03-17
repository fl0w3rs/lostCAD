/* eslint-disable eqeqeq */
// router/middlewares.js

export function auth({ next, store }) {
  if (store.getters.isAuthenticated == false) {
    store.dispatch('showErrorPage', 'У Вас нет доступа');
    return next(false);
  }

  return next();
}

export function admin({ next, store }) {
  if (store.getters.isAdmin == false) {
    store.dispatch('showErrorPage', 'Вы не администратор');
    return next(false);
  }

  return next();
}
