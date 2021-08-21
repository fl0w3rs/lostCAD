<template>
  <div class="row items-center q-py-xs text-uppercase non-selectable">
    <div class="col-12 col-sm-4 text-center">
      <div
        class="clock"
        v-if="!selectedIdentifier"
        @click="openIdentifierWindow"
      >
        ИДЕНТИФИКАТОР НЕ ВЫБРАН
      </div>

      <div
        class="clock"
        v-else
        @click="openIdentifierWindow"
      >
        <p>{{ selectedIdentifier['name'] }}, {{ selectedIdentifier['callsign'] }}</p>
        <p>{{ selectedIdentifier['department'] }} {{ selectedIdentifier['rank'] }}</p>
      </div>
    </div>

    <div class="col-12 col-sm-4">
      <Time />
    </div>

    <div class="col-12 col-sm-4">
      <InfoBar />
    </div>
  </div>
</template>

<script>
import {
  computed,
  onBeforeMount,
} from 'vue';
import { useStore } from 'vuex';

import InfoBar from 'components/topBar/Info';
import Time from 'components/topBar/Time';
import { windowWrapper } from 'src/store/windows/types';

export default {
  name: 'UpperBarComponent',

  components: { InfoBar, Time },

  setup() {
    const store = useStore();

    const openIdentifierWindow = () => {
      store.commit('windows/open', windowWrapper({
        component: 'Identifier',
        type: 'dialog',
        title: 'Идентификатор',
      }));
    };

    onBeforeMount(() => {
      store.dispatch('identifier/request');
    });

    return {
      openIdentifierWindow,
      selectedIdentifier: computed(() => store.getters['identifier/getSelectedIdentifierObject']),
    };
  },
};
</script>

<style>
</style>
