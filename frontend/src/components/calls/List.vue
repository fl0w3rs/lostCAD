<template>
  <div class="text-uppercase">
    <q-table
      dense
      :rows="list" :columns="columns"
      @row-click="onClick"
    >

    </q-table>
  </div>
</template>

<script lang="ts">
import { socketInstance } from 'src/boot/socketio-instance';
import { windowWrapper } from 'src/store/windows/types';
import { callStatusList } from 'src/utils/constants';
import { defineComponent, onBeforeMount, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();

    onBeforeMount(() => {
      socketInstance.emit('calls:getActive');
    });

    const onClick = (evt, row) => {
      store.commit('windows/open', windowWrapper({
        component: 'calls/View',
        type: 'draggable',
        initialWidth: '50vw',
        initialHeight: '500px',
        props: {
          callData: row,
          isDispatcher: true,
        },
      }));
    };

    return {
      list: computed(() => store.getters['calls/getActive']),
      onClick,
      columns: [
        {
          name: 'id', label: 'Номер', field: 'id', sortable: true, align: 'left',
        },
        {
          name: 'type', label: 'Тип', field: 'type', sortable: true, align: 'center',
        },
        {
          name: 'units',
          label: 'Прикреплённые юниты',
          field: 'units',
          sortable: true,
          align: 'center',
          format: (val, row) => (row.units.map((cv) => cv.callsign)).join(', ') || '-',
        },
        {
          name: 'status',
          label: 'Статус',
          field: 'status',
          sortable: true,
          align: 'right',
          format: (val) => callStatusList[val]?.text || 'Ошибка',
          classes: (row) => callStatusList[row.status]?.classes || '',
        },
      ],
    };
  },
});
</script>
