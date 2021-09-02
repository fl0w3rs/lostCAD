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

  'SOCKET_DISPATCH:DUTY:UPDATEDISPATCHERLIST': (state, payload) => {
    state.dispatcherList = payload;

    if (Object.keys(payload).length > 0) state.selfDispatchStatus = false;
  },
  updateSelfDispatchStatus: (state, payload) => {
    state.selfDispatchStatus = payload;
  },
  switchSelfDispatchStatus: (state) => {
    state.selfDispatchStatus = !state.selfDispatchStatus;
  },

};

export default mutations;
