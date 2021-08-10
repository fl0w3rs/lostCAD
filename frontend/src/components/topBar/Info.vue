<template>
  <div class="row q-gutter-sm justify-center">
    <div @click="onClickGameZone">
      <q-icon
        name="o_language"
        size="sm"
      /> {{gameZone}}
    </div>
    <q-separator
      vertical
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
import { socketInstance } from 'src/boot/socketio-instance';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { windowWrapper } from 'src/store/windows/types';

export default {
  setup() {
    const store = useStore();

    socketInstance.emit('gameZone:get');

    const onClickGameZone = () => {
      if (store.getters['user/getCurrentDepartment'] !== 'dispatch') return;

      store.commit('windows/open', windowWrapper({
        component: 'dispatch/EditGameZone',
        type: 'dialog',
        title: 'Изменение игровой зоны',
      }));
    };

    return {
      gameZone: computed(() => store.getters['other/getGameZone']),
      onClickGameZone,
    };
  },
};
</script>

<style>
</style>
