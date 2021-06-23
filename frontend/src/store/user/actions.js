/*
export function someAction (context) {
}
*/
import $socket from 'src/boot/socketio-instance';

export function requestDepartments() {
  $socket.emit('user/departments/get', {});
}

// eslint-disable-next-line camelcase
export function socket_updateUserDepartments({ commit }, payload) {
  commit('user/requestDepartments', payload);
}
