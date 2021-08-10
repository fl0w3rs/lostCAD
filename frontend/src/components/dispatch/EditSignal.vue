<template>
  <div class="text-uppercase row">
    <div class="col-12">
      <q-input
        dense
        square
        outlined
        v-model="signalStatus"
        label="Текущий сигнал"
      />
    </div>

    <div class="col-12 q-mt-sm row justify-center q-gutter-xs">
      <q-btn
        color="green"
        outline
        size="sm"
        @click="save"
        label="Сохранить"
      />
      <q-btn
        color="orange"
        outline
        size="sm"
        @click="clear"
        label="Очистить"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { socketInstance } from 'src/boot/socketio-instance';

export default defineComponent({
  setup() {
    const store = useStore();

    const signalStatus = ref(store.getters['other/getSignal']);

    const save = () => {
      socketInstance.emit('signal:set', signalStatus.value);
    };

    const clear = () => {
      socketInstance.emit('signal:set', 'clear');
    };

    return {
      signalStatus,
      save,
      clear,
    };
  },
});
</script>
