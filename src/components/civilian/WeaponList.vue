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
      dark
      class="shadow-0 bg-grey-10 accentBorder section"
      @row-click="onClickRow"
    />

  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  props: ['weapons', 'type'],
  setup(props) {
    const store = useStore();

    store.dispatch('characters/requestWeapons');

    const onClickRow = (evt, row) => {
      store.commit('window/add', {
        component: 'civilian/Weapon', params: { type: props.type === 'fld' ? 'fld' : 'edit', weapon: row }, windowHeight: 210, title: 'Просмотр оружия',
      });
    };

    const weaponList = props.weapons ? computed(() => props.weapons) : computed(() => store.getters['characters/getSelectedCharacterWeaponList']);

    return {
      weaponList,

      columns: [
        {
          name: 'model', align: 'center', label: 'Модель', field: 'model', sortable: false,
        },
        {
          name: 'serial', align: 'center', label: 'Серийный номер', field: 'serial', sortable: false,
        },
      ],

      onClickRow,
    };
  },
};
</script>

<style>

</style>
