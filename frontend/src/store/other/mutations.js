/*
export function someMutation (state) {
}
*/

import { LocalStorage } from 'quasar';

const mutations = {
  'SOCKET_GAMEZONE:UPDATE': (state, payload) => {
    state.gameZone = payload;
  },

  SOCKET_UPDATEDISPATCHLOG(state, payload) {
    state.dispatchLog = payload;
  },

  SOCKET_UPDATESIGNAL(state, payload) {
    state.signal = payload;
  },

  switchSoundMute(state) {
    state.soundMuted = !state.soundMuted;
    LocalStorage.set('soundMuted', state.soundMuted);
  },

};

export default mutations;
