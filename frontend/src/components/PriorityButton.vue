<template>
  <q-btn
    label="ПРИОРИТЕТ"
    outline
    @click="doPriority"
  />
</template>

<script lang="ts">
import { socketInstance } from 'src/boot/socketio-instance';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const doPriority = () => {
      socketInstance.emit('doPriority');
    };

    return { doPriority };
  },
});
</script>
