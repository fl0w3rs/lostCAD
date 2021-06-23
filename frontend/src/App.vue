<template>
  <router-view />
</template>

<style lang="scss">
// body {
//   background-color: #121212;
// }
</style>

<script>
import { useQuasar } from 'quasar';

export default {
  name: 'App',

  setup() {
    const $q = useQuasar();
    $q.dark.set(true);

    return {};
  },

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
      });
    },
    errorNotifyUnescaped(message) {
      this.$q.notify({
        type: 'negative',
        message,
        html: true,
      });
    },
    successNotify(message) {
      this.$q.notify({
        type: 'positive',
        message,
      });
    },
    successNotifyUnescaped(message) {
      this.$q.notify({
        type: 'positive',
        message,
        html: true,
      });
    },
    unitLogMessage(message) {
      this.$q.notify({
        type: 'unit-info',
        message,
      });
    },
  },
};
</script>
