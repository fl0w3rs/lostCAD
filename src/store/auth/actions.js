import { Notify } from 'quasar';
import $socket from 'src/boot/socketio-instance';

export function authError({ commit }, message) {
  Notify.create({
    type: 'negative',
    message,
    position: 'top',
  });

  commit('authError');
  $socket.close();
}

/* eslint-disable no-underscore-dangle */
export function authRequest({ commit, dispatch }) {
  return new Promise((resolve) => {
    fetch('ak.php').then(async (resp) => {
      const data = await resp.json();
      if (data.status === 'success') {
        $socket.emit('authenticate', { key: data.auth_key });

        const to = setTimeout(() => {
          dispatch('authError', 'Ошибка аутентификации.');
          resolve(false);
        }, 5000);

        $socket.on('authenticated', (payload) => {
          commit('authSuccess');
          commit('user/updateInfo', payload.userdata, { root: true });
          clearTimeout(to);
          $socket.removeAllListeners('authenticated');
          $socket.removeAllListeners('unauthenticated');
          resolve(true);
        });

        $socket.on('unauthenticated', () => {
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
        $socket.emit('authenticate', { key: 'REDACTED_DEV_LOGIN_KEY' });

        $socket.on('authenticated', (payload) => {
          commit('authSuccess');
          commit('user/updateInfo', payload.userdata, { root: true });
          $socket.removeAllListeners('authenticated');
          resolve(true);
        });
      } else {
        dispatch('authError', 'Ошибка аутентификации.');
        resolve(false);
      }
    });
  });
}
