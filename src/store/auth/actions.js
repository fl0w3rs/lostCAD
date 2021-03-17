import Vue from 'vue';

const showErrorNotify = (message) => {
  Vue.prototype.$q.notify({
    type: 'negative',
    message,
    position: 'top',
  });
};

export function authError({ commit }, message) {
  showErrorNotify(message);
  commit('authError');
  Vue.prototype.$socket.client.close();
}

/* eslint-disable no-underscore-dangle */
export function authRequest({ commit, dispatch }) {
  return new Promise((resolve) => {
    fetch('ak.php').then(async (resp) => {
      const data = await resp.json();
      if (data.status === 'success') {
        Vue.prototype.$socket.client.emit('authenticate', { key: data.auth_key });

        const to = setTimeout(() => {
          dispatch('authError', 'Ошибка аутентификации.');
          resolve(false);
        }, 5000);

        Vue.prototype.$socket.client.on('authenticated', (payload) => {
          commit('authSuccess');
          commit('user/updateInfo', payload.userdata, { root: true });
          clearTimeout(to);
          Vue.prototype.$socket.client.removeAllListeners('authenticated');
          Vue.prototype.$socket.client.removeAllListeners('unauthenticated');
          resolve(true);
        });

        Vue.prototype.$socket.client.on('unauthenticated', () => {
          dispatch('authError', 'Вы не участник сообщества..');
          clearTimeout(to);
          resolve(false);
        });
      } else {
        dispatch('authError', 'Вы не авторизованы на форуме.');
        resolve(false);
      }
    }).catch((rsn) => {
      console.log(rsn);
      if (process.env.DEV) {
        Vue.prototype.$socket.client.emit('authenticate', { key: 'REDACTED_DEV_LOGIN_KEY' });

        Vue.prototype.$socket.client.on('authenticated', (payload) => {
          commit('authSuccess');
          commit('user/updateInfo', payload.userdata, { root: true });
          Vue.prototype.$socket.client.removeAllListeners('authenticated');
          resolve(true);
        });
      } else {
        dispatch('authError', 'Ошибка аутентификации.');
        resolve(false);
      }
    });
  });
}
