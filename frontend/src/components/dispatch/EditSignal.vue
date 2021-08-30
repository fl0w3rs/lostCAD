<template>
  <div class="text-uppercase row">
    <small class="text-center text-warning q-mb-sm">
      Для указания нескольких сигналов используйте запятую с пробелом как разделитель,
      иначе система не распознает сигнал как отдельный.
    </small>
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
import { SocketWrapper } from 'src/boot/socketio-instance';
import { useQuasar } from 'quasar';

export default defineComponent({
  props: ['window'],
  setup(props: any) {
    const store = useStore();
    const socketWrapper = new SocketWrapper();
    const $q = useQuasar();

    const signalStatus = ref(store.getters['other/getSignal']);

    const onReturn = (resp) => {
      if (resp !== 'success') {
        $q.notify({
          type: 'negative',
          message: 'Произошла ошибка при изменении сигнала.',
        });
        return;
      }

      $q.notify({
        type: 'positive',
        message: 'Сигнал успешно изменён.',
      });

      props.window.doClose();
    };

    const save = () => {
      socketWrapper.emit('signal:set', signalStatus.value).onReturn(onReturn);
    };

    const clear = () => {
      socketWrapper.emit('signal:set', 'clear').onReturn(onReturn);
    };

    return {
      signalStatus,
      save,
      clear,
    };
  },
});
</script>
