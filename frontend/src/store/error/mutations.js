/*
export function someMutation (state) {
}
*/

export function update(state, payload) {
  state.title = payload.title;
  state.message = payload.message;
}
