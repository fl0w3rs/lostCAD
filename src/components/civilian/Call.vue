<template>
  <div>
    <div class="row q-col-gutter-xs">
      <div class="col-5">
        <q-select
          dense
          options-dense
          dark
          outlined
          v-model="callData.caller"
          label="Звонивший"
          :options="callerList"
          hide-selected
          use-input
          input-debounce="0"
          fill-input
          @input-value="onCallerUpdate"
        />
      </div>
      <div class="col-5">
        <q-select
          dense
          options-dense
          dark
          outlined
          v-model="callData.location"
          label="Местоположение"
          :options="streetListFiltered"
          use-input
          input-debounce="0"
          @filter="streetFilterFn"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">Не найдено</q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-2">
        <q-input
          dense
          type="number"
          dark
          outlined
          v-model="callData.block"
          label="Блок"
        />
      </div>
      <div class="col-12 q-mt-xs">
        <q-input
          dense
          dark
          outlined
          v-model="callData.description"
          label="Описание"
          type="textarea"
        />
      </div>
    </div>

    <div class="q-mt-sm row justify-center q-gutter-sm">
      <q-btn
        icon="o_description"
        color="red"
        outline
        size="sm"
        label="Создать текстовый"
      />
      <q-btn
        icon="o_call"
        color="orange"
        outline
        size="sm"
        label="Создать голосовой"
      />
    </div>
  </div>
</template>

<script>
import { reactive, ref, onBeforeMount } from 'vue';
import { useStore } from 'vuex';

import { streetList } from 'src/utils/constants';

export default {
  setup() {
    const store = useStore();

    const callData = reactive({
      caller: 'Очевидец',
    });

    const callerList = ref(['Очевидец']);

    const onCallerUpdate = (val) => {
      callData.caller = val;
    };

    onBeforeMount(() => {
      const chars = store.getters['characters/getCharacterList'];
      for (let i = 0; i < chars.length; i += 1) {
        callerList.value.push(`${chars[i].name} ${chars[i].surname}`);
      }
    });

    const streetListFiltered = ref(streetList);

    const streetFilterFn = (val, update) => {
      if (val === '') {
        update(() => {
          streetListFiltered.value = streetList;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        streetListFiltered.value = streetList.filter((v) => v.toLowerCase().indexOf(needle) > -1);
      });
    };

    return {
      callData,
      callerList,
      streetListFiltered,
      streetFilterFn,
      onCallerUpdate,
    };
  },
};
</script>

<style>
</style>
