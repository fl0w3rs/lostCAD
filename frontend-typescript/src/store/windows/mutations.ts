import { MutationTree } from 'vuex';
import { WindowStateInterface } from './state';
import { Window } from './types';

const mutation: MutationTree<WindowStateInterface> = {
  open(state, window: Window) {
    state.list.push(window);
  },
};

export default mutation;
