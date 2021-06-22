/*
export function someMutation (state) {
}
*/

export function setCurrentUnit(state, payload) {
  state.currentUnit = payload;
}

export function setAllUnits(state, payload) {
  state.allUnits = payload;
}
