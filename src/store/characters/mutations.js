/*
export function someMutation (state) {
}
*/

export function SOCKET_UPDATECHARACTERS(state, params) {
  state.characterList = params;
}

export function SOCKET_UPDATEVEHICLES(state, params) {
  state.vehicleList = params;
}

export function updateSelected(state, id) {
  state.selectedCharacter = id;
}
