<template>
  <q-table :rows="arrestList" :columns="columns" class="section" @row-click="onRowClick">
    <template v-slot:body-cell-reasons="props">
      <q-td :props="props">
        <small v-for="(reason, key) in props.row.reasons" :key="key">
          {{reason.article}} {{reason.title}}<br/>
        </small>
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
import { windowWrapper } from 'src/store/windows/types';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  props: ['arrestList', 'disableNameColumn'],
  setup(props) {
    const store = useStore();
    const onRowClick = (evt, row) => {
      store.commit('windows/open', windowWrapper({
        type: 'dialog',
        title: 'Арест',
        component: 'arrests/Template',
        initialWidth: '50vw',
        props: {
          arrestData: row,
        },
      }));
    };
    return {
      onRowClick,
      columns: [
        {
          name: 'id',
          label: 'Номер',
          field: 'id',
          align: 'center',
        },
        {
          name: 'name',
          label: props.disableNameColumn ? undefined : 'Имя и Фамилия',
          align: 'center',
          field: (row) => (row.character ? `${row.character.name} ${row.character.surname}` : ''),
        },
        {
          name: 'reasons',
          label: 'Причины',
          align: 'center',
        },
      ],
    };
  },
});
</script>
