import { createStore } from 'vuex';

import auth from './auth';
import user from './user';
import windows from './windows';
import error from './error';
import characters from './characters';
import identifier from './identifier';
import other from './other';
import unit from './unit';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      auth,
      user,
      windows,
      error,
      characters,
      identifier,
      other,
      unit,
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING,
  });

  return Store;
}
