<template>
  <div class="text-uppercase">
    <q-table
      class="shadow-0"
      :rows='list'
      :columns='columns'
      @row-click="onClick">

      <template v-slot:body-cell="props">
        <q-td
          :props="props"
          :class="props.row.panic == true ? 'bg-orange-14' : ''"
        >
          {{props.value}}
        </q-td>
      </template>

    </q-table>
  </div>
</template>

<script>
import { computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { socketInstance } from 'src/boot/socketio-instance';

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
        text: 'НЕ ДОСТУПЕН',
        class: 'text-red',
      },
      avail: {
        text: 'ДОСТУПЕН',
        class: 'text-cyan',
      },
      busy: {
        text: 'ЗАНЯТ',
        class: 'text-orange',
      },
      enroute: {
        text: 'В ПУТИ',
        class: 'text-blue',
      },
      onscene: {
        text: 'НА СЦЕНЕ',
        class: 'text-green',
      },
    };

    const onClick = (evt, row) => {
      if (props.type === 'join') {
        $q.dialog({
          title: 'Присоединение к юниту',
          message: `Вы уверены, что хотите присоединиться к юниту ${row.callsign}?`,
          cancel: true,
          persistent: true,
        }).onOk(() => {
          socketInstance.emit('unit/join', row.id);
          props.window.closeFn();
        });
      }
    };

    onBeforeMount(() => { store.dispatch('unit/requestAllUnits'); });

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
              names.push(row?.members[i]?.callsign || 'ошибка получения');
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
          classes: (row) => `${row.panic ? '' : statuses[row.status].class} text-bold`,
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
