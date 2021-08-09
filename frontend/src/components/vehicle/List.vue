<template>
  <div class="text-uppercase">
    <div class="text-left sectionTitle">
      СПИСОК Т/С
    </div>
    <q-table
      dense
      :rows="vehicleList"
      :columns="columns"
      row-key="id"
      class="shadow-0 bg-grey-10 accentBorder section"
      @row-click="onClickVehicleRow"
    />

  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { windowWrapper } from 'src/store/windows/types';

let store;

export default {
  props: ['vehicles', 'type', 'showOwners'],
  setup(props) {
    store = useStore();

    store.dispatch('characters/requestVehicles');

    const onClickVehicleRow = (evt, row) => {
      store.commit('windows/open', windowWrapper({
        component: 'vehicle/Template',
        props: { type: props.type === 'dmv' ? 'dmv' : 'edit', vehicle: row },
        title: 'Просмотр Т/С',
        type: 'draggable',
        initialWidth: '700px',
        initialHeight: '350px',
      }));
    };

    const vehicleList = props.vehicles ? computed(() => props.vehicles) : computed(() => store.getters['characters/getSelectedCharacterVehicleList']);

    const columns = [
      {
        name: 'numberplate', align: 'center', label: 'Номера', field: 'numberplate', sortable: false,
      },
    ];

    if (props.showOwners) {
      columns.push(
        {
          name: 'charName', align: 'center', label: 'Имя', field: 'charName', sortable: false,
        },
        {
          name: 'charSurname', align: 'center', label: 'Фамилия', field: 'charSurname', sortable: false,
        },
      );
    }

    columns.push(
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
    );

    return {
      vehicleList,

      columns,

      onClickVehicleRow,
    };
  },
};
</script>

<style>
</style>
