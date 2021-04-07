/* eslint-disable camelcase */
import { LocalStorage } from 'quasar';

export function SOCKET_UPDATEIDENTIFIERS(state, payload) {
  state.list = payload.list;

  state.selected = LocalStorage.getItem('selectedIdentifier') || null;
}

export function selectIdentifier(state, id) {
  state.selected = id;

  LocalStorage.set('selectedIdentifier', id);
}
