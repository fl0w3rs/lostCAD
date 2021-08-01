import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthenticationStateInterface } from './state';

const getters: GetterTree<AuthenticationStateInterface, StateInterface> = {
  getStatus: (state) => state.status,
};

export default getters;
