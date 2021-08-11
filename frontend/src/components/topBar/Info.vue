<template>
  <div class="row q-gutter-sm justify-center">
    <div @click="onClickGameZone">
      <q-icon
        name="o_language"
        size="sm"
      /> {{gameZone}}
      <q-tooltip>Игровая зона</q-tooltip>
    </div>
    <!-- <q-separator
      vertical
    /> -->

    <q-icon
      name="o_podcasts"
      size="sm"
      color="grey"
      class="q-pl-md"
    >
      <q-tooltip>Наличие активного диспетчера</q-tooltip>
    </q-icon>

    <q-icon
      name="o_info"
      size="sm"
      color="green"
    >
      <q-tooltip>Наличие диспетчера по сбору информации</q-tooltip>
    </q-icon>

    <q-icon
      name="o_phone"
      size="sm"
      color="grey"
    >
      <q-tooltip>Наличие оператора 911</q-tooltip>
    </q-icon>

    <q-icon
      name="o_volume_up"
      size="sm"
      class="cursor-pointer q-pl-md"
    >
      <q-tooltip>Звуковые оповещения</q-tooltip>
    </q-icon>
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
