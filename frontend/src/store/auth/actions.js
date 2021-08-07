import { Notify } from 'quasar';
import { socketInstance, SocketWrapper } from 'src/boot/socketio-instance';

export function authError({ commit }, message) {
  Notify.create({
    type: 'negative',
    message,
  });

  commit('authError');
  socketInstance.close();
}

/* eslint-disable no-underscore-dangle */
export function authRequest({ commit, dispatch }) {
  return new Promise((resolve) => {
    const socketWrapper = new SocketWrapper({ hookComponentLifeCycle: false });

    const applySuccess = (userdata) => {
      commit('authSuccess');
      commit('user/updateInfo', userdata, { root: true });
      resolve(true);
    };

    const applyError = (message) => {
      dispatch('authError', message);
      resolve(false);
    };

    fetch('/api/getAuthKey').then(async (resp) => {
      const data = await resp.json();

      if (data.status === 'success') {
        const to = setTimeout(() => {
          applyError('Ошибка аутентификации.');
        }, 5000);

        socketWrapper.emit('authenticate', { key: data.auth_key }).onReturn((payload) => {
          clearTimeout(to);

          if (payload.status === 'authenticated') {
            applySuccess(payload.userdata);
          } else if (payload.status === 'unauthenticated') {
            applyError('Вы не участник сообщества.');
          }
        });
      } else {
        applyError('Вы не авторизованы на форуме.');
      }
    }).catch((rsn) => {
      console.log(rsn);
      if (process.env.DEV) {
        socketWrapper.emit('authenticate', { key: 'REDACTED_DEV_LOGIN_KEY' }).onReturn((payload) => {
          if (payload.status === 'authenticated') {
            applySuccess(payload.userdata);
          }
        });
      } else {
        applyError('Ошибка аутентификации.');
      }
    });
  });
}
