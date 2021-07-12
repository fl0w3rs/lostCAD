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

export function SOCKET_UPDATESIGNAL100(state, payload) {
  state.signal100 = payload;
}

// eslint-disable-next-line global-require
const priorityAudio = new Audio(require('src/assets/sounds/unitNotify.mp3'));

export function SOCKET_UPDATEPRIORITY(state, payload) {
  // eslint-disable-next-line eqeqeq
  if (payload == 1) {
    priorityAudio.play();
  }
  state.priority = payload;
}
