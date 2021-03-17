/*
export function someMutation (state) {
}
*/

export function SOCKET_UPDATECHARACTERS(state, params) {
  state.characterList = params;
}

export function updateSelected(state, id) {
  state.selectedCharacter = id;
}
