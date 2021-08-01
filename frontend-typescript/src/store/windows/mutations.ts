import { MutationTree } from 'vuex';
import { WindowStateInterface } from './state';
import { IWindow } from './types';

let windowLatestId = 0;
let zIndex = 0;

const getWindowElementNumber = (state: WindowStateInterface, id: number) => {
  for (let i = 0; i < state.list.length; i += 1) {
    if (state.list[i].id === id) return i;
  }
  return 0;
};

const mutation: MutationTree<WindowStateInterface> = {
  open(state, window: IWindow) {
    // eslint-disable-next-line no-plusplus
    state.list.push({ ...window, id: ++windowLatestId, zIndex: ++zIndex });
  },
  click(state, id: number) {
    const elId = getWindowElementNumber(state, id);
    // eslint-disable-next-line no-plusplus
    state.list[elId].zIndex = ++zIndex;
  },
};

export default mutation;
