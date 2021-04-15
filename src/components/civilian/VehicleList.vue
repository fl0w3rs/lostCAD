<template>
  <div class="q-pa-sm">
    <div class="text-left sectionTitle">
      СПИСОК Т/С
      <span class="text-green cursor-pointer"
        @click="$store.commit('window/add', {
          component: 'civilian/Vehicle',
          params: { type: 'create' }, title: 'Создание т/с',
          dialog: true, dialogMinWidth: '45vw',
        });">
        <q-icon name="fas fa-plus"/>
      </span>
    </div>
    <q-table
      dense
      :rows="vehicles"
      :columns="columns"
      row-key="id"
      dark
      class="shadow-0 bg-grey-10 accentBorder"
      @row-click="onClickVehicleRow"
    />

  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

let store;

export default {
  setup() {
    store = useStore();

    store.dispatch('characters/requestVehicles');

    const onClickVehicleRow = (evt, row) => {
      store.commit('window/add', {
        component: 'civilian/Vehicle', params: { type: 'edit', vehicle: row }, windowHeight: 250, title: 'Просмотр т/с',
      });
    };

    return {
      vehicles: computed(() => store.getters['characters/getSelectedCharacterVehicleList']),

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
      ],

      onClickVehicleRow,
    };
  },
};
</script>

<style>

</style>
