/*
export function someAction (context) {
}
*/
import { socketInstance } from 'src/boot/socketio-instance';

export function requestDepartments() {
  socketInstance.emit('user/departments/get', {});
}

// eslint-disable-next-line camelcase
export function socket_updateUserDepartments({ commit }, payload) {
  commit('user/requestDepartments', payload);
}
