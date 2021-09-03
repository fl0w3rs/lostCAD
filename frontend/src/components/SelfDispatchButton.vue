<template>
  <q-btn label="Диспетчерская"
    :color="selfDispatchStatus ? 'green' : 'white'" size="sm"
    outline @click="onClick" v-if="isSelfDispatchAvailable">

  </q-btn>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();

    return {
      selfDispatchStatus: computed(() => store.getters['other/getSelfDispatchStatus']),
      isSelfDispatchAvailable: computed(() => store.getters['other/isSelfDispatchAvailable']),
      onClick: () => store.commit('other/switchSelfDispatchStatus'),
    };
  },
});
</script>
