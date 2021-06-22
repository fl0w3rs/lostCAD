/* eslint-disable camelcase */
import { LocalStorage } from 'quasar';
import $socket from 'src/boot/socketio-instance';

export function SOCKET_UPDATEIDENTIFIERS(state, payload) {
  state.list = payload.list;

  state.selected = LocalStorage.getItem('selectedIdentifier') || null;
  $socket.emit('user/selectIdentifier', state.selected);
}

export function selectIdentifier(state, id) {
  if (!id) $socket.emit('unit/leave');

  state.selected = id;

  $socket.emit('user/selectIdentifier', id);

  LocalStorage.set('selectedIdentifier', id);
}
