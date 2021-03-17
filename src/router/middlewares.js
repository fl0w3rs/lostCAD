/* eslint-disable eqeqeq */
// router/middlewares.js

export function auth({ next, store }) {
  if (store.getters['auth/isAuthenticated'] == false) {
    store.dispatch('error/show', 'У Вас нет доступа');
    return next(false);
  }

  return next();
}

export function admin({ next, store }) {
  if (store.getters['user/isAdmin'] == false) {
    store.dispatch('error/show', 'Вы не администратор');
    return next(false);
  }

  return next();
}

export function police({ next, store }) {
  if (!store.getters['user/getDepartments'].police) {
    store.dispatch('error/show', 'У Вас нет доступа к этому департаменту.');
    return next(false);
  }

  return next();
}

export function dispatch({ next, store }) {
  if (!store.getters['user/getDepartments'].dispatch) {
    store.dispatch('error/show', 'У Вас нет доступа к этому департаменту.');
    return next(false);
  }

  return next();
}

export function civilian({ next, store }) {
  if (!store.getters['user/getDepartments'].civilian) {
    store.dispatch('error/show', 'У Вас нет доступа к этому департаменту.');
    return next(false);
  }

  return next();
}

export function fire({ next, store }) {
  if (!store.getters['user/getDepartments'].fire) {
    store.dispatch('error/show', 'У Вас нет доступа к этому департаменту.');
    return next(false);
  }

  return next();
}
