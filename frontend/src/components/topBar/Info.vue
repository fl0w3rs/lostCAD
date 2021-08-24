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
      :color="dispatcherList?.active?.length > 0 ? 'green' : 'grey'"
      class="q-pl-md"
    >
      <q-tooltip class="text-center">
        Наличие активного диспетчера
        <p
          v-for="(disp, key) in dispatcherList?.active"
          v-bind:key = "key" :class="key == 0 ? 'q-mt-sm' : ''"
          class="text-uppercase text-bold"
        >
          {{disp.name}} {{disp?.callsign ? `[${disp.callsign}]` : ''}}
        </p>
      </q-tooltip>

    </q-icon>

    <q-icon
      name="o_info"
      size="sm"
      :color="dispatcherList?.info?.length > 0 ? 'green' : 'grey'"
    >
      <q-tooltip class="text-center">
        Наличие диспетчера по сбору информации
        <p
          v-for="(disp, key) in dispatcherList?.info"
          v-bind:key = "key" :class="key == 0 ? 'q-mt-sm' : ''"
          class="text-uppercase text-bold"
        >
          {{disp.name}} {{disp?.callsign ? `[${disp.callsign}]` : ''}}
        </p>
      </q-tooltip>
    </q-icon>

    <q-icon
      name="o_phone"
      size="sm"
      :color="dispatcherList?.operator?.length > 0 ? 'green' : 'grey'"
    >
      <q-tooltip class="text-center">
        Наличие оператора 911
        <p
          v-for="(disp, key) in dispatcherList?.operator"
          v-bind:key = "key" :class="key == 0 ? 'q-mt-sm' : ''"
          class="text-uppercase text-bold"
        >
          {{disp.name}} {{disp?.callsign ? `[${disp.callsign}]` : ''}}
        </p>

      </q-tooltip>
    </q-icon>

    <q-icon
      :name="isSoundMuted ? 'o_volume_off' : 'o_volume_up'"
      size="sm"
      class="cursor-pointer q-pl-md"
      @click="$store.commit('other/switchSoundMute')"
    >
      <q-tooltip>Звуковые оповещения</q-tooltip>
    </q-icon>
  </div>
</template>

<script>
import { socketInstance, SocketWrapper } from 'src/boot/socketio-instance';
import { useStore } from 'vuex';
import { computed, onBeforeMount } from 'vue';
import { windowWrapper } from 'src/store/windows/types';

export default {
  setup() {
    const store = useStore();
    const socketWrapper = new SocketWrapper();

    // gz change

    const onClickGameZone = () => {
      if (store.getters['user/getCurrentDepartment'] !== 'dispatch') return;

      store.commit('windows/open', windowWrapper({
        component: 'dispatch/EditGameZone',
        type: 'dialog',
        title: 'Изменение игровой зоны',
      }));
    };

    // shared

    onBeforeMount(() => {
      socketWrapper.emit('dispatch:duty:requestDispatcherList');
      socketInstance.emit('gameZone:get');
    });

    return {
      gameZone: computed(() => store.getters['other/getGameZone']),
      onClickGameZone,

      isSoundMuted: computed(() => store.getters['other/isSoundMuted']),

      dispatcherList: computed(() => store.getters['other/getDispatcherList']),
    };
  },
};
</script>

<style>
</style>
