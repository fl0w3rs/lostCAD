import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { WindowStateInterface } from './state';

const actions: ActionTree<WindowStateInterface, StateInterface> = {
  someAction(/* context */) {
    // your code
  },
};

export default actions;
