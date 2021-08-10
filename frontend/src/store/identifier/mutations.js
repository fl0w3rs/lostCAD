/* eslint-disable camelcase */
import { LocalStorage } from 'quasar';
import { socketInstance } from 'src/boot/socketio-instance';

export function SOCKET_UPDATEIDENTIFIERS(state, payload) {
  state.list = payload.list;

  state.selected = LocalStorage.getItem('selectedIdentifier') || null;
  socketInstance.emit('identifiers:select', state.selected);
}

export function selectIdentifier(state, id) {
  if (state.selected !== id) socketInstance.emit('units:leave', null);

  state.selected = id;

  socketInstance.emit('identifiers:select', id);

  LocalStorage.set('selectedIdentifier', id);
}
