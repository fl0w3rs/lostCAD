/*
export function someAction (context) {
}
*/
import $socket from 'src/boot/socketio-instance';

export function requestCurrentUnit() {
  $socket.emit('unit/getAll', null);
}

// eslint-disable-next-line camelcase
export function socket_updateAllUnits({ rootGetters, commit }, payload) {
  commit('setAllUnits', payload);

  const currentIdentifier = rootGetters['identifier/getSelectedIdentifier'];
  for (let i = 0; i < payload.length; i += 1) {
    for (let j = 0; j < payload[i].members.length; j += 1) {
      if (payload[i].members[j].id === currentIdentifier) {
        commit('setCurrentUnit', payload[i]);
        return;
      }
    }
  }

  commit('setCurrentUnit', false);
}
