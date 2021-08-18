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
        :readonly="!isDispatcher"
        options-dense
      ></q-select>
    </div>
    <div class="col-6 col-md-4">
      <q-select
        label="Приоритет" outlined dense
        v-model="data.priority" :options="['Низкий', 'Средний', 'Высокий']"
        :readonly="!isDispatcher"
        options-dense
      ></q-select>
    </div>
    <div class="col-6 col-md-5">
      <q-input
        label="Местоположение" outlined dense v-model="data.location"
        :readonly="!isDispatcher"></q-input>
    </div>
    <div class="col-6 col-md-2">
      <q-input
        label="Блок" outlined dense v-model="data.blockNumber"
        :readonly="!isDispatcher"></q-input>
    </div>
    <div class="col-6 col-md-5">
      <q-select
        label="Тип вызова" outlined dense
        v-model="data.type" :options="callTypeList"
        :readonly="!isDispatcher"
        options-dense
      >
        <template v-slot:selected-item="scope">
          <div class="ellipsis">{{scope.opt}}</div>
        </template>
      </q-select>
    </div>
    <div class="col-12">
      <q-input
        label="Описание" readonly outlined dense
        v-model="data.description" type="textarea"></q-input>
    </div>
    <div class="col-12">
      <q-field outlined readonly dense label="Примечания к вызову" stack-label>
        <template v-slot:control>
          <q-scroll-area class="full-width q-py-xs" style="height: 130px;">
            <b>fl0w3rs</b>: test
          </q-scroll-area>
          <!-- <div class="self-center full-width no-outline" tabindex="0">Field content</div> -->
        </template>
      </q-field>
    </div>
    <div class="col-12">
      <q-input outlined dense label="Новое примечание" v-model="newNote">
        <template v-slot:append>
          <q-btn outline label="Добавить" color="green" size="sm" />
        </template>
      </q-input>
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

    const newNote = ref('');

    return {
      data,
      callTypeList,
      statusListComputed: computed(() => Object.entries(callStatusList).map((val) => ({
        value: val[0], text: val[1].text,
      }))),
      newNote,
    };
  },
});
</script>
