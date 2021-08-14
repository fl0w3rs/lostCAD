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
        >
          {{props.value}}
          <q-menu touch-position v-if="type == 'dispatch'">
            <q-list dense style="min-width: 100px">
              <q-item @click="dispatchDisband(props.row)" clickable v-close-popup>
                <q-item-section>Расформировать</q-item-section>
              </q-item>
              <q-item @click="dispatchSetCallsign(props.row)" clickable v-close-popup>
                <q-item-section>Изменить маркировку</q-item-section>
              </q-item>
              <q-item @click="dispatchSwitchPanic(props.row)" clickable v-close-popup>
                <q-item-section>
                  {{props.row.panic ? 'Выключить' : 'Включить'}} панику
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
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
        text: 'НЕДОСТУПЕН',
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
          socketInstance.emit('units:join', row.id);
          props.window.doClose();
        });
      }
    };

    onBeforeMount(() => { store.dispatch('unit/requestAllUnits'); });

    const dispatchDisband = (unit) => {
      $q.dialog({
        title: 'Расформирование юнита',
        message: `Вы уверены, что хотите расформировать юнит ${unit.callsign}?`,
        cancel: true,
        persistent: true,
        ok: {
          label: 'Да',
          flat: true,
        },
      }).onOk(() => {
        socketInstance.emit('units:disband', { dispatch: true, unitId: unit.id });
      });
    };

    const dispatchSetCallsign = (unit) => {
      $q.dialog({
        title: 'Изменение маркировки',
        message: 'Введите новую маркировку в поле ниже.',
        prompt: {
          model: unit.callsign,
          type: 'text',
        },
        cancel: true,
        persistent: true,
      }).onOk((data) => {
        socketInstance.emit('units:setCallsign', { dispatch: true, unitId: unit.id, newCallsign: data });
      });
    };

    const dispatchSwitchPanic = (unit) => {
      socketInstance.emit('units:switchPanic', { dispatch: true, unitId: unit.id });
    };

    return {
      dispatchSwitchPanic,
      dispatchDisband,
      dispatchSetCallsign,
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
          classes: (row) => `${row.panic ? 'text-red panic-blinking' : statuses[row.status].class} text-bold`,
          // field: (row) => statuses[row.status].text,
          format: (val, row) => (row.panic ? '! ПАНИКА !' : statuses[row.status].text),
          sortable: true,
        },
      ],
      list: computed(() => store.getters['unit/getAllUnits']),
      onClick,
    };
  },
};
</script>

<style>
.panic-blinking{
  animation: unitListPanicBlink 2s infinite;
}
@keyframes unitListPanicBlink {
  0%  { background-color: rgba(143, 8, 8, 0.3);}
  50% { background-color: rgba(255, 99, 71, 0);}
  100%  { background-color: rgba(143, 8, 8, 0.3);}
}
</style>
