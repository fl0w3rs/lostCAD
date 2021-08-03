<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from './store';
import { socketInstance } from './boot/socketio-instance';

export default defineComponent({
  name: 'App',
  setup() {
    const $q = useQuasar();
    const store = useStore();

    socketInstance.on('connect', () => {
      void store.dispatch('authentication/init');
    });

    socketInstance.on('disconnect', () => {
      store.commit('authentication/socketDisconnected');
    });

    $q.dark.set(true);
  },
});
</script>
