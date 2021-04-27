<template>
  <div>
    <div class="row q-col-gutter-xs">
      <div class="col-6">
        <q-select
          dense options-dense
          dark outlined v-model="callData.caller" label="Звонивший"
          :options="callerList"
        />
      </div>
      <div class="col-6">
        <q-input
          dense
          dark outlined v-model="callData.location" label="Местоположение"
        />

      </div>
      <div class="col-12 q-mt-xs">
        <q-input
          dense
          dark outlined v-model="callData.description" label="Описание"
          type="textarea"
        />

      </div>
    </div>

    <div class="q-mt-sm row justify-center q-gutter-sm">
      <q-btn icon="o_description" color="red" outline size="sm" label="Создать текстовый" />
      <q-btn icon="o_call" color="orange" outline size="sm" label="Создать голосовой" />
    </div>
  </div>
</template>

<script>
import { reactive, ref, onBeforeMount } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const callData = reactive({
      caller: 'Очевидец',
    });

    const callerList = ref(['Очевидец']);

    onBeforeMount(() => {
      const chars = store.getters['characters/getCharacterList'];
      for (let i = 0; i < chars.length; i += 1) {
        callerList.value.push(`${chars[i].name} ${chars[i].surname}`);
      }
    });

    return {
      callData,
      callerList,
    };
  },
};
</script>

<style>

</style>
