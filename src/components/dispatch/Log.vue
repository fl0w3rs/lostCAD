<template>
  <div>
    <p class="text-h6">Лог диспетчера</p>
    <q-input
      class="q-mt-sm text-uppercase"
      v-model="dispatchLog"
      filled
      readonly
      rows="10"
      type="textarea"
    />

  </div>
</template>

<script>
import { computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    onBeforeMount(() => { store.dispatch('other/requestDispatchLog'); });

    return {
      dispatchLog: computed(() => store.getters['other/getDispatchLog']),
    };
  },
};
</script>
