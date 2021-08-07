/* eslint-disable camelcase */
import { LocalStorage } from 'quasar';
import { socketInstance } from 'src/boot/socketio-instance';

export function SOCKET_UPDATEIDENTIFIERS(state, payload) {
  state.list = payload.list;

  state.selected = LocalStorage.getItem('selectedIdentifier') || null;
  socketInstance.emit('user/selectIdentifier', state.selected);
}

export function selectIdentifier(state, id) {
  if (state.selected !== id) socketInstance.emit('unit/leave', null);

  state.selected = id;

  socketInstance.emit('user/selectIdentifier', id);

  LocalStorage.set('selectedIdentifier', id);
}
