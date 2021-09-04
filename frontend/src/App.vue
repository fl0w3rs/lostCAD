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
import { socketInstance, SocketWrapper } from 'src/boot/socketio-instance';
import { useStore } from 'vuex';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { Howl } from 'howler';

const unitNotifyAudio = new Howl({
  src: [require('src/assets/sounds/unitNotify.mp3')],
});
const panicAudio = new Howl({
  src: [require('src/assets/sounds/panic.mp3')],
});
const signalAudio = new Howl({
  src: [require('src/assets/sounds/signal.mp3')],
});
const newCallAudio = new Howl({
  src: [require('src/assets/sounds/newCall.mp3')],
});
const unitAttachAudio = new Howl({
  src: [require('src/assets/sounds/unitAttach.mp3')],
});
const priorityAudio = new Howl({
  src: [require('src/assets/sounds/priority.mp3')],
});

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

const useSounds = () => {
  const store = useStore();
  const socketWrapper = new SocketWrapper();

  const canPlay = ({ ignoreMuted = false }) => (ignoreMuted || !store.getters['other/isSoundMuted'])
    && store.getters['user/getCurrentDepartment'] !== 'civilian'
    && store.getters['user/getCurrentDepartment'] !== null;

  const getUnits = () => store.getters['unit/getAllUnits'];

  const isPanicEnabled = () => {
    const units = getUnits();

    for (let i = 0; i < units.length; i += 1) {
      // eslint-disable-next-line no-continue
      if (!units[i].panic) continue;
      return true;
    }

    return false;
  };

  socketWrapper.listen('panic:sound', () => {
    if (!canPlay({ ignoreMuted: true })) return;
    panicAudio.play();
  }, { ignoreWrapperID: true });

  socketWrapper.listen('calls:sound:new', () => {
    if (!canPlay({ ignoreMuted: true })) return;
    newCallAudio.play();
  }, { ignoreWrapperID: true });

  socketWrapper.listen('calls:sound:attach', () => {
    if (!canPlay({ ignoreMuted: true })) return;
    unitAttachAudio.play();
  }, { ignoreWrapperID: true });

  socketWrapper.listen('updateSignal', (data) => {
    if (!canPlay({ ignoreMuted: true })) return;
    if (isPanicEnabled()) return;

    const signals = data.split(', ');
    if (signals.includes('100')) signalAudio.play();
  }, { ignoreWrapperID: true });

  socketWrapper.listen('doPriority', () => {
    if (!canPlay({ ignoreMuted: true })) return;
    priorityAudio.play();
  }, { ignoreWrapperID: true });

  let interval;

  onBeforeMount(async () => {
    interval = setInterval(() => {
      if (!canPlay()) return;

      if (!isPanicEnabled()) {
        const signals = store.getters['other/getSignal'].split(', ') || [];

        if (signals.includes('100')) signalAudio.play();
      }

      setTimeout(() => {
        if (!canPlay()) return;

        if (isPanicEnabled()) panicAudio.play();
      }, 5000);
    }, 12000);
  });

  onBeforeUnmount(() => {
    clearInterval(interval);
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
    useSounds();

    $q.dark.set(true);

    return {};
  },
};
</script>
