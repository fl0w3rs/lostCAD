<template>
    <div class="row items-center q-py-xs">
        <div class="col-4">
          <div class="clock" v-if="!selectedIdentifier" @click="openIdentifierWindow">
            ИДЕНТИФИКАТОР НЕ ВЫБРАН
          </div>

          <div class="clock" v-else @click="openIdentifierWindow">
            <p>{{ selectedIdentifier['name'] }}</p>
            <p>{{ selectedIdentifier['rank'] }} | {{ selectedIdentifier['callsign'] }}</p>
          </div>
        </div>

        <div class="col-4">
          <div class="clock">
            <p>{{ rDate }}</p>
            <p>{{ rTime }}</p>
          </div>
        </div>

        <div class="col-4">
          <GameZone/>
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

import GameZone from 'components/GameZone';

export default {
  name: 'UpperBarComponent',

  components: { GameZone },

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
          daysShort: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
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
