<template>
  <router-view />
</template>

<style lang="scss">
body {
  background-color: #121212;
}
</style>

<script>
export default {
  name: 'App',

  sockets: {
    connect() {
      console.log('socket connected');
      this.$store.dispatch('auth/authRequest');
    },
    disconnect() {
      console.log('socket disconnected');
      this.$store.commit('auth/socketDisconnected');
    },
    errorNotify(message) {
      this.$q.notify({
        type: 'negative',
        message,
        position: 'top',
      });
    },
    errorNotifyUnescaped(message) {
      this.$q.notify({
        type: 'negative',
        message,
        position: 'top',
        html: true,
      });
    },
    successNotify(message) {
      this.$q.notify({
        type: 'positive',
        message,
        position: 'top',
      });
    },
    successNotifyUnescaped(message) {
      this.$q.notify({
        type: 'positive',
        message,
        position: 'top',
        html: true,
      });
    },
  },
};
</script>
