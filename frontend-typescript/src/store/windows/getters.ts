import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { WindowStateInterface } from './state';

const getters: GetterTree<WindowStateInterface, StateInterface> = {
  getList(state) {
    return state.list;
  },
};

export default getters;
