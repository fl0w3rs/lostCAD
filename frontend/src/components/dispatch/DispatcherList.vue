<template>
  <div class="">
    <q-table
      dense
      :rows="dispatcherList"
      :columns="columns"
      class="bg-transparent"
      flat
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
            <q-menu touch-position>
              <q-list dense style="min-width: 100px">
                <q-item @click="dispatchStopDuty(props.row)" clickable v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="close" color="red" />
                  </q-item-section>
                  <q-item-section>Завершить смену</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { SocketWrapper } from 'src/boot/socketio-instance';
import { defineComponent, onBeforeMount, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const socketWrapper = new SocketWrapper();
    const store = useStore();
    const $q = useQuasar();

    onBeforeMount(() => {
      socketWrapper.emit('dispatch:duty:requestDispatcherList');
    });

    const dispatchTypeNames = {
      active: 'Активный',
      operator: 'Оператор 911',
      info: 'Обработка информации',
    };

    const dispatchStopDuty = (row) => {
      $q.dialog({
        title: 'Завершение смены',
        message: `Вы уверены, что хотите завершить смену диспетчера ${row.name}?`,
        cancel: true,
        persistent: true,
        ok: {
          label: 'Да',
          flat: true,
        },
      }).onOk(() => {
        socketWrapper.emit('dispatch:duty:forceStop', { userId: row.id });
      });
    };

    return {
      dispatchStopDuty,
      dispatcherList: computed(() => {
        const list = store.getters['other/getDispatcherList'];
        const listComputed: Array<any> = [];

        const listEntries = Object.entries(list);
        listEntries.forEach((dispatchObject: any) => {
          dispatchObject[1].forEach((dispatcher) => {
            listComputed.push({ ...dispatcher, type: dispatchObject[0] });
          });
        });

        return listComputed;
      }),
      columns: [
        {
          name: 'name',
          label: 'Диспетчер',
          field: 'name',
          format: (val, row) => `${row.callsign ? `[${row.callsign}]` : ''} ${row.name}`,
          align: 'left',
        },
        {
          name: 'type',
          label: 'Тип',
          field: 'type',
          format: (val) => dispatchTypeNames[val] || val,
          align: 'right',
        },
      ],
    };
  },
});
</script>
