export function authRequest(state) {
  state.status = false;
}

export function authSuccess(state) {
  state.status = true;
  state.initialized = true;
}

export function authError(state) {
  state.status = false;
  state.initialized = true;
}

export function socketDisconnected(state) {
  state.status = false;
}
