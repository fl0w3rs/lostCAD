let windowLatestId = 0;
let zIndex = 0;

const getWindowElementNumber = (state, id) => {
  for (let i = 0; i < state.list.length; i += 1) {
    if (state.list[i].id === id) return i;
  }

  return 0;
};

export function open(state, window) {
  // eslint-disable-next-line no-plusplus
  state.list.push({ ...window, id: ++windowLatestId, zIndex: ++zIndex });
}

export function click(state, id) {
  const elId = getWindowElementNumber(state, id);
  // eslint-disable-next-line no-plusplus
  state.list[elId].zIndex = ++zIndex;
}

export function close(state, id) {
  const elId = getWindowElementNumber(state, id);
  state.list.splice(elId, 1);
}

export function clearAll(state) {
  state.list = [];
}
