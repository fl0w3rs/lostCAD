import { MutationTree } from 'vuex';
import { AuthenticationStateInterface } from './state';

const mutation: MutationTree<AuthenticationStateInterface> = {
  success(state: AuthenticationStateInterface) {
    state.status = true;
  },
  error(state: AuthenticationStateInterface) {
    state.status = false;
  },
  socketInitialized(state: AuthenticationStateInterface) {
    state.socketInitialized = true;
  },
  socketDisconnected(state: AuthenticationStateInterface) {
    state.status = false;
  },
};

export default mutation;
