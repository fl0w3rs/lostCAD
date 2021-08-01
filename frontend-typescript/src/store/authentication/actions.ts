import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthenticationStateInterface } from './state';

const actions: ActionTree<AuthenticationStateInterface, StateInterface> = {
  init(/* context */) {
    // your code
  },
};

export default actions;
