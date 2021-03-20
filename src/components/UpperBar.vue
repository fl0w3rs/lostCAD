<template>
    <div class="row items-center q-py-xs">
        <div class="col-6">
            <span class="clock">
              ИДЕНТИФИКАТОР НЕ ВЫБРАН
            </span>
        </div>

        <div class="col-6">
            <span class="clock">
                {{ date }}<br/>
                {{ time }}
            </span>
        </div>
    </div>
</template>

<script>
import { date } from 'quasar';

export default {
  name: 'UpperBarComponent',

  data() {
    return {
      date: '0000-00-00 DDD',
      time: '00:00',
    };
  },

  mounted() {
    setInterval(() => {
      const now = Date.now();
      this.date = date.formatDate(now, 'YYYY-MM-DD ddd', {
        daysShort: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      });
      this.time = date.formatDate(now, 'HH:mm:ss');
    }, 1000);
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
