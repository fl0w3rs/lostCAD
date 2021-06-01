<template>
  <div class="row">
    <div class="col-12 col-md-6">
      <q-input
        dense
        dark
        square
        outlined
        v-model="info.name"
        label="Название"
      />
    </div>
    <div class="col-12 col-md-6">
      <q-select
        dense
        options-dense
        dark
        square
        outlined
        v-model="info.type"
        label="Тип департамента"
        :options="departmentTypeList"
      />
    </div>
    <div class="col-12">
      <q-input
        dense
        dark
        square
        outlined
        v-model="info.divisions"
        label="Список дивизий (разделять через |||)"
        autogrow
      />
    </div>
    <div class="col-12">
      <q-select
        dense
        options-dense
        dark
        square
        outlined
        v-model="info.groups"
        emit-value
        map-options
        multiple
        label="Группы с доступом"
        :options="groupList"
      />
    </div>
  </div>
</template>

<script>
import { ref, watch, onBeforeMount } from 'vue';
import { departmentTypeList } from 'src/utils/constants';
import { getAllGroupNames } from 'src/utils/api';

export default {
  props: {
    type: String,
    dept: Object,
  },

  setup(props) {
    const info = ref({ ...props.dept });
    watch(() => props.dept, (val) => { info.value = val; });

    // const generateFinalVar = () => {
    //   const data = info.value;
    //   data.groups = data.groups.join(',');
    //   return data;
    // };

    const groupList = ref([]);

    onBeforeMount(async () => {
      const resp = await getAllGroupNames();
      for (let i = 0; i < resp.length; i += 1) {
        groupList.value.push({ label: resp[i].name, value: resp[i].id });
      }

      info.value.groups = info.value.groups.split(',').map((i) => Number(i));
    });

    return { info, departmentTypeList, groupList };
  },
};
</script>

<style>
</style>
