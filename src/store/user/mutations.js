/*
export function someMutation (state) {
}
*/

export function requestDepartments(state, payload) {
  state.departments = payload;
}

export function updateInfo(state, payload) {
  state.name = payload.name;
  state.isAdmin = payload.isAdmin;
}
