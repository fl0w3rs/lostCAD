<template>
    <div class="row items-center q-py-xs">
        <div class="col-6">
          <div class="clock" v-if="!selectedIdentifier" @click="openIdentifierWindow">
            ИДЕНТИФИКАТОР НЕ ВЫБРАН
          </div>

          <div class="clock" v-else @click="openIdentifierWindow">
            <p>{{ selectedIdentifier['name'] }}</p>
            <p>{{ selectedIdentifier['rank'] }} | {{ selectedIdentifier['callsign'] }}</p>
          </div>
        </div>

        <div class="col-6">
          <div class="clock">
            {{ rDate }}<br/>
            {{ rTime }}
          </div>
        </div>
    </div>
</template>

<script>
import { date } from 'quasar';
import {
  ref,
  onBeforeUnmount,
  computed,
  onMounted,
} from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'UpperBarComponent',

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

    onMounted(() => {
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

<style scoped>
.clock {
  font-family: Share Tech Mono,monospace;
  color: #fff;
  text-shadow: 0 0 20px #0aafe6, 0 0 20px rgb(10 175 230 / 0%);
}
</style>
