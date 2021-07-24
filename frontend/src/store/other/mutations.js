/*
export function someMutation (state) {
}
*/

export function SOCKET_GAMEZONEUPDATE(state, payload) {
  state.gameZone = payload;
}

export function SOCKET_UPDATEDISPATCHLOG(state, payload) {
  state.dispatchLog = payload;
}

export function SOCKET_UPDATESIGNAL(state, payload) {
  state.signal = payload;
}

// eslint-disable-next-line global-require
const priorityAudio = new Audio(require('src/assets/sounds/unitNotify.mp3'));

export function SOCKET_DOPRIORITY() {
  priorityAudio.play();
}
