<template>
  <div class="text-uppercase row">
    <div class="col-12">
      <q-input
        dense
        options-dense
        square
        outlined
        v-model="info.callsign"
        label="Маркировка"
      />

    </div>
    <div class="col-12 q-mt-sm">
      <q-btn class="full-width" color="green" @click="create" outline label="Создать"></q-btn>

    </div>
  </div>
</template>

<script>
import { reactive, onBeforeMount, onBeforeUnmount } from 'vue';
import $socket from 'src/boot/socketio-instance';

export default {
  props: {
    window: { type: Object },
  },
  setup(props) {
    const socketWrapper = $socket.initWrapper();

    onBeforeMount(socketWrapper.mount);
    onBeforeUnmount(socketWrapper.unmount);

    const info = reactive({ callsign: '' });

    const create = () => {
      if (info.callsign.length < 2 || info.callsign.length > 32) {
        return;
      }

      socketWrapper.emit('unit/create', info, {
        onReturn(resp) {
          if (resp === 'success') props.window.closeFn();
        },
      });
    };

    return {
      info,
      create,
    };
  },
};
</script>
