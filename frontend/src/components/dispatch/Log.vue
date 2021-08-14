<template>
  <div>
    <p class="text-h6">Лог диспетчера</p>
    <q-scroll-area
      style="height: 200px;"
      class="bg-dark"
    >
      <div class="q-pa-sm full-width" style="min-height: 200px">
        <span v-html="dispatchLog" v-if="dispatchLog.length > 0" />
        <span class="text-grey" v-else>Пока что тут пусто.</span>
      </div>
    </q-scroll-area>
    <!-- <q-input
      class="q-mt-sm text-uppercase"
      v-model="dispatchLog"
      filled
      readonly
      rows="10"
      type="textarea"
    /> -->

  </div>
</template>

<script>
import { computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import bbCodeParser from 'js-bbcode-parser';

export default {
  setup() {
    const store = useStore();

    onBeforeMount(() => { store.dispatch('other/requestDispatchLog'); });

    return {
      dispatchLog: computed(() => bbCodeParser.parse(store.getters['other/getDispatchLog'])),
    };
  },
};
</script>
