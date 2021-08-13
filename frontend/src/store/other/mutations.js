/*
export function someMutation (state) {
}
*/

import { LocalStorage } from 'quasar';

const priorityAudio = new Audio(require('src/assets/sounds/priority.wav'));

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

  SOCKET_DOPRIORITY(state) {
    if (state.soundMuted) return;
    priorityAudio.play();
  },

  switchSoundMute(state) {
    state.soundMuted = !state.soundMuted;
    LocalStorage.set('soundMuted', state.soundMuted);
  },

};

export default mutations;
