<template>
  <div class="text-uppercase">
    <div class="text-left sectionTitle">
      СПИСОК ОРУЖИЯ
    </div>
    <q-table
      dense
      :rows="weaponList"
      :columns="columns"
      row-key="id"
      class="shadow-0 bg-grey-10 accentBorder section"
      @row-click="onClickRow"
    />

  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { windowWrapper } from 'src/store/windows/types';

export default {
  props: ['weapons', 'type', 'showOwners'],
  setup(props) {
    const store = useStore();

    store.dispatch('characters/requestWeapons');

    const onClickRow = (evt, row) => {
      store.commit('windows/open', windowWrapper({
        component: 'weapon/Template',
        type: 'draggable',
        props: { type: props.type === 'fld' ? 'fld' : 'edit', weapon: row },
        initialHeight: '230px',
        initialWidth: '700px',
        title: 'Просмотр оружия',
      }));
    };

    const weaponList = props.weapons ? computed(() => props.weapons) : computed(() => store.getters['characters/getSelectedCharacterWeaponList']);

    const columns = [
      {
        name: 'model', align: 'center', label: 'Модель', field: 'model', sortable: false,
      },
      {
        name: 'serial', align: 'center', label: 'Серийный номер', field: 'serial', sortable: false,
      },
    ];

    if (props.showOwners) {
      columns.unshift(
        {
          name: 'charName', align: 'center', label: 'Имя', field: 'charName', sortable: false,
        },
        {
          name: 'charSurname', align: 'center', label: 'Фамилия', field: 'charSurname', sortable: false,
        },
      );
    }

    return {
      weaponList,

      columns,

      onClickRow,
    };
  },
};
</script>

<style>
</style>
