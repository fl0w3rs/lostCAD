<template>
  <div>
    <q-tabs
      v-model="currentTab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab
        name="citations" :label="`ШТРАФЫ (${records.citations?.length})`"
        v-if="records.citations?.length > 0"
      />
      <q-tab
        name="arrests" :label="`АРЕСТЫ (${records.arrests?.length})`"
        v-if="records.arrests?.length > 0"
      />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="currentTab" animated>
      <q-tab-panel name="arrests">
        <arrest-list
          :arrestList="records.arrests"
          dense
          :disableNameColumn="true"
        />

      </q-tab-panel>

      <q-tab-panel name="citations">
        <citation-list
          :citationList="records.citations"
          dense
          :disableNameColumn="true"
        />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script lang="ts">
import { SocketWrapper } from 'src/boot/socketio-instance';
import { defineComponent, onBeforeMount, ref } from 'vue';
import { useStore } from 'vuex';
import CitationList from 'src/components/citations/List.vue';
import ArrestList from 'src/components/arrests/List.vue';

export default defineComponent({
  components: { ArrestList, CitationList },
  setup() {
    const store = useStore();
    const socketWrapper = new SocketWrapper();

    const records = ref({});
    const currentTab = ref(null);

    onBeforeMount(() => {
      const characterId = store.getters['characters/getSelectedCharacterId'];

      socketWrapper.emit('characters:getRecords', { characterId }).onReturn((payload: any) => {
        records.value = payload;
      });
    });

    return { records, currentTab };
  },
});
</script>
