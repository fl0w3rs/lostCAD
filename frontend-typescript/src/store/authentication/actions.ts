import { Notify } from 'quasar';
import { SocketWrapper } from 'src/boot/socketio-instance';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthenticationStateInterface } from './state';

const actions: ActionTree<AuthenticationStateInterface, StateInterface> = {
  init({ commit }) {
    const socket = new SocketWrapper({ hookComponentLifeCycle: false });

    const applyError = (message: string) => {
      commit('error');

      Notify.create({
        type: 'negative',
        message,
      });

      socket.instance.close();
    };

    const applySuccess = (userData: unknown) => {
      commit('success');
      console.log(userData);
    };

    void fetch('api/getAuthKey').then(async (resp) => {
      // eslint-disable-next-line camelcase
      const data = (await resp.json()) as { status: string; auth_key: string; };

      if (data.status !== 'success') {
        return applyError('Вы не авторизованы на форуме.');
      }

      socket.emit('authenticate', { key: data.auth_key }).onReturn((pl) => {
        console.log(pl);
        // if (pl.status === 'authenticated') {
        //   applySuccess(pl.userdata);
        // } else if (pl.status === 'unauthenticated') {
        //   applyError('Вы не участник сообщества.');
        // }
      });

      return true;
    }).catch((rsn) => {
      console.log(rsn);
      if (process.env.DEV) {
        socket.emit('authenticate', { key: 'REDACTED_DEV_LOGIN_KEY' }).onReturn((pl) => {
          console.log(pl);
        });
      } else {
        applyError('Ошибка аутентификации.');
      }
    });
  },
};

export default actions;

/*

const socketWrapper = $socket.initWrapper();
    socketWrapper.mount();

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

        socketWrapper.emit('authenticate', { key: data.auth_key }, {
          onReturn: (payload) => {
            clearTimeout(to);

            if (payload.status === 'authenticated') {
              applySuccess(payload.userdata);
            } else if (payload.status === 'unauthenticated') {
              applyError('Вы не участник сообщества.');
            }

            socketWrapper.unmount();
          },
        });
      } else {
        applyError('Вы не авторизованы на форуме.');
      }
    }).catch((rsn) => {
      console.log(rsn);
      if (process.env.DEV) {
        socketWrapper.emit('authenticate', { key: 'REDACTED_DEV_LOGIN_KEY' }, {
          onReturn: (payload) => {
            if (payload.status === 'authenticated') {
              applySuccess(payload.userdata);
            }
          },
        });
      } else {
        applyError('Ошибка аутентификации.');
      }
    });
*/
