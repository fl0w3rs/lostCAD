/*
export function someGetter (state) {
}
*/

export function getGameZone(state) {
  return state.gameZone;
}

export function getDispatchLog(state) {
  return state.dispatchLog;
}

export function getSignal(state) {
  return state.signal;
}

export const isSoundMuted = (state) => state.soundMuted;
