<template>
  <div class="q-gutter-x-xs">
    <q-btn
      outline
      :color="(dispatchStatus === 'off' || !dispatchStatus) ? 'green' : 'grey'"
      label="ОФФ"
      @click="setStatus('off')"
    />
    <q-btn
      :color="dispatchStatus === 'active' ? 'green' : 'grey'"
      outline
      label="АКТИВНЫЙ"
      @click="setStatus('active')"
    />
    <q-btn
      outline
      :color="dispatchStatus === 'info' ? 'green' : 'grey'"
      label="СБОР ИНФОРМАЦИИ"
      @click="setStatus('info')"
    />
    <q-btn
      outline
      :color="dispatchStatus === 'operator' ? 'green' : 'grey'"
      label="ОПЕРАТОР 911"
      @click="setStatus('operator')"
    />
  </div>
</template>

<script lang="ts">
import { SocketWrapper } from 'src/boot/socketio-instance';
import { defineComponent, onBeforeMount, ref } from 'vue';

export default defineComponent({
  setup() {
    const socketWrapper = new SocketWrapper();

    const dispatchStatus = ref('off');

    onBeforeMount(() => {
      socketWrapper.emit('dispatch:duty:requestStatus', {});
    });

    socketWrapper.listen('dispatch:duty:updateStatus', (payload: any) => {
      dispatchStatus.value = payload;
    }, { ignoreWrapperID: true });

    const setStatus = (status) => {
      socketWrapper.emit('dispatch:duty:setStatus', status);
    };

    return { dispatchStatus, setStatus };
  },
});
</script>
