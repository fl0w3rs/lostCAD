<template>
  <div v-if="signalStatus > 0" class="full-width bg-red text-white text-bold">
    СИГНАЛ {{ signalStatus }} АКТИВИРОВАН
  </div>
</template>

<script>
import { onBeforeMount, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    onBeforeMount(() => { store.dispatch('other/requestSignal'); });
    return { signalStatus: computed(() => store.getters['other/getSignal']) };
  },
};
</script>
