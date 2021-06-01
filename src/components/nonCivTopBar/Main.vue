<template>
  <div class="row items-center q-py-xs text-uppercase">
    <div class="col-12 col-sm-4">
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
      <div class="clock">
        <p>{{ rDate }}</p>
        <p>{{ rTime }}</p>
      </div>
    </div>

    <div class="col-12 col-sm-4">
      <InfoBar />
    </div>
  </div>
</template>

<script>
import { date } from 'quasar';
import {
  ref,
  onBeforeUnmount,
  computed,
  onBeforeMount,
} from 'vue';
import { useStore } from 'vuex';

import InfoBar from 'components/nonCivTopBar/Info';

export default {
  name: 'UpperBarComponent',

  components: { InfoBar },

  setup() {
    const store = useStore();

    const rDate = ref('YYYY-MM-DD ddd');
    const rTime = ref('HH:mm:ss');

    let timeInterval;

    const openIdentifierWindow = () => {
      store.commit('window/add', {
        component: 'Identifier',
        dialog: true,
        title: 'Идентификатор',
      });
    };

    onBeforeMount(() => {
      store.dispatch('identifier/request');

      timeInterval = setInterval(() => {
        const now = Date.now();
        rDate.value = date.formatDate(now, 'YYYY-MM-DD ddd', {
          daysShort: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
        });
        rTime.value = date.formatDate(now, 'HH:mm:ss');
      }, 1000);
    });

    onBeforeUnmount(() => {
      clearInterval(timeInterval);
    });

    return {
      rDate,
      rTime,
      openIdentifierWindow,
      selectedIdentifier: computed(() => store.getters['identifier/getSelectedIdentifierObject']),
    };
  },
};
</script>

<style>
</style>
