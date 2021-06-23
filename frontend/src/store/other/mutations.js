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
