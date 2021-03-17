/*
export function someAction (context) {
}
*/
import Vue from 'vue';

export function request() {
  Vue.prototype.$socket.client.emit('user/civilian/characters/get', {});
}
