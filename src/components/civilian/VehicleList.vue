<template>
  <div class="q-pa-sm">
    <div class="text-left sectionTitle">
      СПИСОК Т/С
      <span class="text-green cursor-pointer" v-if="type != 'ncic'"
        @click="$store.commit('window/add', {
          component: 'civilian/Vehicle',
          params: { type: 'create' }, title: 'Создание Т/С',
          dialog: true, dialogMinWidth: '60vw',
        });">
        <q-icon name="fas fa-plus"/>
      </span>
    </div>
    <q-table
      dense
      :rows="vehicleList"
      :columns="columns"
      row-key="id"
      dark
      class="shadow-0 bg-grey-10 accentBorder section"
      @row-click="onClickVehicleRow"
    />

  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

let store;

export default {
  props: ['vehicles', 'type'],
  setup(props) {
    store = useStore();

    store.dispatch('characters/requestVehicles');

    const onClickVehicleRow = (evt, row) => {
      store.commit('window/add', {
        component: 'civilian/Vehicle', params: { type: props.type === 'dmv' ? 'dmv' : 'edit', vehicle: row }, windowHeight: 350, title: 'Просмотр Т/С',
      });
    };

    const vehicleList = props.vehicles ? computed(() => props.vehicles) : computed(() => store.getters['characters/getSelectedCharacterVehicleList']);

    return {
      vehicleList,

      columns: [
        {
          name: 'numberplate', align: 'center', label: 'Номера', field: 'numberplate', sortable: false,
        },
        {
          name: 'mark', align: 'center', label: 'Марка', field: 'mark', sortable: false,
        },
        {
          name: 'model', align: 'center', label: 'Модель', field: 'model', sortable: false,
        },
        {
          name: 'color', align: 'center', label: 'Цвет', field: 'color', sortable: false,
        },
        {
          name: 'type', align: 'center', label: 'Тип кузова', field: 'type', sortable: false,
        },
      ],

      onClickVehicleRow,
    };
  },
};
</script>

<style>

</style>
