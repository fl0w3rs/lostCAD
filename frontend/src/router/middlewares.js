/* eslint-disable eqeqeq */
// router/middlewares.js

export function auth({ next, store }) {
  if (store.getters['auth/isAuthenticated'] == false) {
    store.dispatch('error/show', { message: 'У Вас нет доступа' });
    return next(false);
  }

  return next();
}

export function admin({ next, store }) {
  if (store.getters['user/isAdmin'] == false) {
    store.dispatch('error/show', { message: 'Вы не администратор' });
    return next(false);
  }

  return next();
}

export function emptyDepartment({ next, store }) {
  store.commit('user/setCurrentDepartment', null);

  return next();
}

const depts = {
  police: {},
  dispatch: {},
  fire: {},
  civilian: {},
};

const keys = Object.keys(depts);
for (let i = 0; i < keys.length; i += 1) {
  const name = keys[i];

  depts[name] = ({ next, store }) => {
    if (!store.getters['user/getDepartments'][name]) {
      store.dispatch('error/show', { message: 'У Вас нет доступа к этому департаменту.' });
      return next(false);
    }

    store.commit('user/setCurrentDepartment', name);

    return next();
  };
}

export const {
  police, fire, dispatch, civilian,
} = depts;
