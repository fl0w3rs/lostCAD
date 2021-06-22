<template>
  <div class="text-uppercase">
    <q-table
      class="shadow-0"
      :rows='list'
      :columns='columns'
      @row-click="onClick">
    </q-table>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import $socket from 'src/boot/socketio-instance';

export default {
  props: {
    type: String,
    window: Object,
  },
  setup(props) {
    const $q = useQuasar();
    const store = useStore();
    const statuses = {
      unavail: {
        text: 'UNAVAILABLE',
        class: 'text-red',
      },
      avail: {
        text: 'AVAILABLE',
        class: 'text-cyan',
      },
      busy: {
        text: 'BUSY',
        class: 'text-orange',
      },
      enroute: {
        text: 'ENROUTE',
        class: 'text-blue',
      },
      onscene: {
        text: 'ON SCENE',
        class: 'text-green',
      },
    };

    const onClick = (evt, row) => {
      console.log(props);
      if (props.type === 'join') {
        $q.dialog({
          title: 'Присоединение к юниту',
          message: `Вы уверены, что хотите присоединиться к юниту ${row.callsign}?`,
          cancel: true,
          persistent: true,
        }).onOk(() => {
          $socket.emit('unit/join', row.id);
          props.window.closeFn();
        });
      }
    };

    return {
      columns: [
        {
          name: 'callsign',
          required: true,
          label: 'Маркировка',
          align: 'center',
          field: (row) => row.callsign,
          sortable: true,
        },
        {
          name: 'members',
          required: true,
          label: 'Участники',
          align: 'center',
          field: (row) => {
            const names = [];
            for (let i = 0; i < row.members.length; i += 1) {
              names.push(row.members[i].callsign);
            }
            return names.join(', ');
          },
          sortable: true,
        },
        {
          name: 'status',
          required: true,
          label: 'Статус',
          align: 'center',
          classes: (row) => statuses[row.status].class,
          field: (row) => statuses[row.status].text,
          sortable: true,
        },
      ],
      list: computed(() => store.getters['unit/getAllUnits']),
      onClick,
    };
  },
};
</script>
