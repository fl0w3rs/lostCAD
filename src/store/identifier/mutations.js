/* eslint-disable camelcase */
import { LocalStorage } from 'quasar';
import $socket from 'src/boot/socketio-instance';

export function SOCKET_UPDATEIDENTIFIERS(state, payload) {
  state.list = payload.list;

  state.selected = LocalStorage.getItem('selectedIdentifier') || null;
}

export function selectIdentifier(state, id) {
  state.selected = id;

  $socket.emit('user/selectIdentifier', id);

  LocalStorage.set('selectedIdentifier', id);
}
