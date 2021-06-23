/*
export function someAction (context) {
}
*/

export function show({ commit }, payload) {
  commit('update', payload);
  if (this.$router.currentRoute.path !== '/error') {
    this.$router.push('/error');
  }
}
