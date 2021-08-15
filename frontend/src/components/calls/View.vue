<template>
  <div class="row q-col-gutter-xs">
    <div class="col-6 col-md-4">
      <q-input label="Заявитель" outlined dense readonly v-model="data.caller"></q-input>
    </div>
    <div class="col-6 col-md-4">
      <q-select
        label="Статус" outlined dense
        v-model="data.status" :options="statusListComputed"
        map-options emit-value
        option-label="text"
        option-value="value"
        options-dense
      ></q-select>
    </div>
    <div class="col-6 col-md-4">
      <q-select
        label="Приоритет" outlined dense
        v-model="data.priority" :options="[1, 2, 3]"
        options-dense
      ></q-select>
    </div>
    <div class="col-6 col-md-6">
      <q-input label="Местоположение" outlined dense v-model="data.location"></q-input>
    </div>
    <div class="col-6 col-md-2">
      <q-input label="Блок" outlined dense v-model="data.blockNumber"></q-input>
    </div>
    <div class="col-6 col-md-4">
      <q-select
        label="Тип вызова" outlined dense
        v-model="data.type" :options="callTypeList"
        options-dense
      ></q-select>
    </div>
    <div class="col-12">
      <q-input
        label="Описание" readonly outlined dense
        v-model="data.description" type="textarea"></q-input>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, watch, ref, computed,
} from 'vue';
import { callStatusList, callTypeList } from 'src/utils/constants';

export default defineComponent({
  props: {
    callData: {
      type: Object,
      required: true,
    },
    isDispatcher: {
      type: Boolean,
    },
  },
  setup(props) {
    const data = ref({ ...props.callData });
    watch(() => props.callData, (val) => { data.value = val; });
    return {
      data,
      callTypeList,
      statusListComputed: computed(() => Object.entries(callStatusList).map((val) => ({
        value: val[0], text: val[1].text,
      }))),
    };
  },
});
</script>
