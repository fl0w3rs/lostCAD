/* eslint-disable eqeqeq */

let currentWindowId = 1;

export function close(state, id) {
  for (let i = 0; i < state.windowList.length; i += 1) {
    if (state.windowList[i].id == id) {
      state.windowList.splice(i, 1);
      break;
    }
  }
}

export function add(state, payload) {
  state.currentWindowZ += 1;

  const tmpId = currentWindowId;
  state.windowList.push({
    id: currentWindowId,
    component: payload.component,
    title: payload.title || 'Browser',
    params: payload.params || {},
    dialog: payload.dialog || false,
    dialogMinWidth: payload.dialogMinWidth || 'none',
    windowHeight: payload.windowHeight || null,
    closeFn: () => { this.commit('window/close', tmpId); },
  });

  currentWindowId += 1;
}

export function click(state, payload) {
  if (payload.id != state.lastClickedWindowId) {
    state.currentWindowZ += 1;
    state.lastClickedWindowId = payload.id;
  }
}

export function clearAll(state) {
  state.windowList = [];
}
