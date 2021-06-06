<template>
  <div class="row q-gutter-sm justify-center">
    <div>
      <q-icon
        name="o_language"
        size="sm"
      /> LS
    </div>
    <q-separator
      vertical
      dark
    ></q-separator>
    <q-icon
      name="o_volume_up"
      size="sm"
    />
    <q-icon
      name="o_podcasts"
      size="sm"
    />
    <q-icon
      name="o_info"
      size="sm"
    />
    <q-icon
      name="o_phone"
      size="sm"
    />
  </div>
</template>

<script>
import $socket from 'src/boot/socketio-instance';

export default {
  setup() {
    const socketWrapper = $socket.initWrapper();

    socketWrapper.emit('gameZone/get');
  },
};
</script>

<style>
</style>
