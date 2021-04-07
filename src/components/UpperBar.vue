<template>
    <div class="row items-center q-py-xs">
        <div class="col-6">
          <div class="clock" v-if="!selectedIdentifier">
            ИДЕНТИФИКАТОР НЕ ВЫБРАН
          </div>

          <div class="clock" v-else>
            <p>{{ selectedIdentifier['name'] }}</p>
            <p>{{ selectedIdentifier['rank'] }} | {{ selectedIdentifier['callsign'] }}</p>
          </div>
        </div>

        <div class="col-6">
          <div class="clock">
            {{ date }}<br/>
            {{ time }}
          </div>
        </div>
    </div>
</template>

<script>
import { date } from 'quasar';

export default {
  name: 'UpperBarComponent',

  data() {
    return {
      date: 'YYYY-MM-DD ddd',
      time: 'HH:mm:ss',
      interval: null,
    };
  },

  computed: {
    selectedIdentifier() {
      return this.$store.getters['identifier/getSelectedIdentifierObject'];
    },
  },

  mounted() {
    this.$store.dispatch('identifier/request');

    this.interval = setInterval(() => {
      const now = Date.now();
      this.date = date.formatDate(now, 'YYYY-MM-DD ddd', {
        daysShort: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      });
      this.time = date.formatDate(now, 'HH:mm:ss');
    }, 1000);
  },

  beforeUnmount() {
    clearInterval(this.interval);
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
