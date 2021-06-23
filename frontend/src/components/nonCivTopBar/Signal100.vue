<template>
  <div v-if="signal100status == 1" class="full-width bg-red text-white text-bold">
    СИГНАЛ 100 АКТИВИРОВАН
  </div>
</template>

<script>
import { onBeforeMount, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    onBeforeMount(() => { store.dispatch('other/requestSignal100'); });
    return { signal100status: computed(() => store.getters['other/getSignal100']) };
  },
};
</script>
