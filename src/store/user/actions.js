/*
export function someAction (context) {
}
*/
export function requestDepartments({ Vue }) {
  Vue.prototype.$socket.client.emit('user/departments/get', {});
}

// eslint-disable-next-line camelcase
export function socket_updateUserDepartments({ commit }, payload) {
  commit('user/requestDepartments', payload);
}
