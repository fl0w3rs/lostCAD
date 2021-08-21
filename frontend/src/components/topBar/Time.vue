<template>
  <div class="clock text-center">
    <p>{{ rDate }}</p>
    <p>{{ rTime }}</p>
  </div>
</template>

<script>
import { date } from 'quasar';
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';

export default {
  setup() {
    const rDate = ref('YYYY-MM-DD ddd');
    const rTime = ref('HH:mm:ss');

    let timeInterval;

    onBeforeMount(() => {
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

    return { rDate, rTime };
  },
};
</script>
