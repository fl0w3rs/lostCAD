<template>
  <div class="text-uppercase row">
    <div class="col-12">
      <q-input
        dense
        dark
        square
        outlined
        v-model="gameZone"
        label="Игровая зона"
      />
    </div>

    <div class="col-12 q-mt-sm row justify-center">
      <q-btn
        color="green"
        outline
        class="shadow-2"
        @click="save"
        icon="fas fa-save"
        label="Сохранить"
      />
    </div>
  </div>
</template>

<script>
import { ref, onBeforeMount, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import socketInstance from 'src/boot/socketio-instance';
import { useQuasar } from 'quasar';

export default {
  props: ['window'],
  setup(props) {
    const store = useStore();
    const $q = useQuasar();

    const socketWrapper = socketInstance.initWrapper();
    onBeforeMount(socketWrapper.mount);
    onBeforeUnmount(socketWrapper.unmount);

    const gameZone = ref(store.getters['other/getGameZone']);
    const save = () => {
      socketWrapper.emit('gameZone/set', gameZone.value, {
        onReturn: (resp) => {
          if (resp !== 'success') return;

          $q.notify({
            type: 'positive',
            message: 'Игровая зона успешно изменена',
          });

          props.window.closeFn();
        },
      });
    };

    return { gameZone, save };
  },
};
</script>
