<template>
  <div class="row">
    <div class="col-6">
      <q-input
        dense
        v-model="data.name"
        label="Имя и Фамилия"
        readonly
        outlined
      />
    </div>
    <div class="col-6">
      <q-input
        dense
        v-model="data.callsign"
        label="Позывной"
        readonly
        outlined
      />
    </div>
    <div class="col-6">
      <q-input
        dense
        v-model="data.department"
        label="Департамент"
        readonly
        outlined
      />
    </div>
    <div class="col-6">
      <q-input
        dense
        v-model="data.division"
        label="Дивизия"
        readonly
        outlined
      />
    </div>
    <div class="col-12">
      <q-input
        dense
        v-model="data.rank"
        label="Звание"
        readonly
        outlined
      />
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: ['identifierData'],
  setup(props) {
    const data = ref(_.cloneDeep(props.identifierData) || {});

    return { data };
  },
});
</script>
