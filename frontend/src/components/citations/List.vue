<template>
  <q-table :rows="citationList" :columns="columns" class="section" @row-click="onRowClick">
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
  props: ['citationList'],
  setup() {
    const store = useStore();
    const onRowClick = (evt, row) => {
      store.commit('windows/open', windowWrapper({
        type: 'dialog',
        component: 'citations/Template',
        title: 'Штраф',
        initialWidth: '50vw',
        props: {
          citationData: row,
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
          label: 'Имя и Фамилия',
          align: 'center',
          field: (row) => `${row.character.name} ${row.character.surname}`,
        },
        {
          name: 'reasons',
          label: 'Причины',
          align: 'center',
          field: (row) => `${row.character.name} ${row.character.surname}`,
        },
      ],
    };
  },
});
</script>
