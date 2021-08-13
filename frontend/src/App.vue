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
import { socketInstance } from 'src/boot/socketio-instance';
import { useStore } from 'vuex';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { getAudioDuration } from './utils/functions';

const unitNotifyAudio = new Audio(require('src/assets/sounds/unitNotify.mp3'));
const panicAudio = new Audio(require('src/assets/sounds/panic.wav'));

const useSocketNotifications = () => {
  const $q = useQuasar();

  socketInstance.on('errorNotify', (message) => {
    $q.notify({
      type: 'negative',
      message,
    });
  });

  socketInstance.on('errorNotifyUnescaped', (message) => {
    $q.notify({
      type: 'negative',
      message,
      html: true,
    });
  });

  socketInstance.on('successNotify', (message) => {
    $q.notify({
      type: 'positive',
      message,
    });
  });

  socketInstance.on('successNotifyUnescaped', (message) => {
    $q.notify({
      type: 'positive',
      message,
      html: true,
    });
  });

  socketInstance.on('unitLogMessage', (message) => {
    $q.notify({
      type: 'unit-info',
      message,
    });
    unitNotifyAudio.play();
  });
};

const usePanicSoundCheck = () => {
  const store = useStore();

  let panicCheckInterval;

  onBeforeMount(async () => {
    const duration = await getAudioDuration(panicAudio);
    panicCheckInterval = setInterval(() => {

    }, (duration * 1000) + 10000);
  });

  onBeforeUnmount(() => {
    clearInterval(panicCheckInterval);
  });
};

export default {
  name: 'App',

  setup() {
    const $q = useQuasar();
    const store = useStore();

    socketInstance.on('connect', () => {
      console.log('socket connected');
      store.dispatch('auth/authRequest');
    });

    socketInstance.on('disconnect', () => {
      console.log('socket disconnected');
      store.commit('auth/socketDisconnected');
    });

    useSocketNotifications();
    usePanicSoundCheck();

    $q.dark.set(true);

    return {};
  },
};
</script>
