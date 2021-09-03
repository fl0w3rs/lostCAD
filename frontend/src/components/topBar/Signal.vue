<template>
  <div v-if="signalList.length > 0" class="full-width text-center bg-red text-white text-bold">
    КОД{{ signalList.length > 1 ? 'Ы' : '' }}
    <span v-for="(signal, key) in signalList" :key="key">
      <!-- {{key}} {{signalList.length}}, -->
      {{ key != 0 ? (key + 1 == signalList.length) ? ' И ' : ', ' : '' }}
      {{ signal }}
    </span>
    АКТИВИРОВАН{{ signalList.length > 1 ? 'Ы' : '' }}
  </div>
</template>

<script>
import { onBeforeMount, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    onBeforeMount(() => { store.dispatch('other/requestSignal'); });
    return {
      signalList: computed(() => (store.getters['other/getSignal'] || '').split(', ').filter((o) => o)),
    };
  },
};
</script>
