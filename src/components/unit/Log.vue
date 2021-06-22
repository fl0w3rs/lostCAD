<template>
  <div class="text-uppercase">
    <q-input
      v-model="currentUnit.log"
      filled
      readonly
      rows="12"
      type="textarea"
    />
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  setup() {
    const store = useStore();

    return {
      currentUnit: computed(() => store.getters['unit/getCurrentUnit']),
    };
  },
};
</script>
