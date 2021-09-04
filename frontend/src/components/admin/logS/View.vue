<template>
  <q-table
    dense
    :rows="rows"
    :columns="columns"
    :pagination="{
      rowsPerPage: 15,
      sortBy: 'id',
      descending: true
    }"
    flat
  ></q-table>
</template>

<script lang="ts">
import { SocketWrapper } from 'src/boot/socketio-instance';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: ['type', 'userId'],
  setup(props) {
    const rows = ref([]);
    const socketWrapper = new SocketWrapper();

    if (props.type === 'user' && props.userId) {
      socketWrapper.emit('logs:getByUser', props.userId).onReturn((payload: any) => {
        rows.value = payload;
      });
    }

    return {
      rows,
      columns: [
        {
          name: 'id',
          field: 'id',
          align: 'left',
          style: 'display: none',
          headerStyle: 'display: none',
        },
        {
          name: 'time',
          field: (row) => row.additional.time || 0,
          label: 'Время',
          align: 'left',
          format: (val) => {
            const date = new Date(val * 1000);
            return `${date.toLocaleTimeString()}, ${date.toLocaleDateString()}`;
          },
        },
        {
          name: 'text',
          field: 'text',
          label: 'Текст',
          align: 'center',
        },
        {
          name: 'ip',
          field: (row) => row.additional.ip || '-',
          label: 'IP',
          align: 'right',
        },
      ],
    };
  },
});
</script>
