<template>
  <div class="q-pa-sm">
    {{selectedIdentifier}}
    <div v-if="!selectedIdentifier">
      f
    </div>

    <div v-else>
      <div class="row q-col-gutter-sm">
        <div class="col-6">
          <q-input dense dark filled v-model="currentIdentifier.name" label="Имя" />
        </div>
        <div class="col-6">
          <q-input dense dark filled v-model="currentIdentifier.callsign" label="Позывной" />
        </div>
        <div class="col-12">
          <q-input dense dark filled v-model="currentIdentifier.rank" label="Звание" />
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref, watch } from 'vue';

export default {
  setup() {
    const store = useStore();

    const selectedIdentifier = computed(() => store.getters['identifier/getSelectedIdentifierObject']);

    const currentIdentifier = ref(store.getters['identifier/getSelectedIdentifierObject']);

    watch(selectedIdentifier, (newval) => {
      console.log(newval);
      currentIdentifier.value = newval;
    });

    return {
      selectedIdentifier,
      allIdentifiers: computed(() => store.getters['identifier/getAllIdentifiers']),
      currentIdentifier,
    };
  },
};
</script>
