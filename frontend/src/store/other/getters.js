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

export const getDispatcherList = (state) => state.dispatcherList;

export function getSelfDispatchStatus(state) {
  return state.selfDispatchStatus;
}

export function isSelfDispatchAvailable(state) {
  if (Object.keys(state.dispatcherList).length > 0) return false;

  return true;
}
