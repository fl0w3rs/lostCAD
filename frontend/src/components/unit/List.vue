<template>
  <div class="text-uppercase">
    <q-table
      dense
      :rows='list'
      :columns='columns'
      @row-click="onClick"
      flat
      class="bg-transparent"
      :pagination="{
        rowsPerPage: 0
      }"
    >

      <template v-slot:body-cell="props">
        <q-td
          :props="props"
        >
          {{props.value}}
          <unit-menu v-if="type == 'dispatch'" :unit="props.row" />
        </q-td>
      </template>

      <template v-slot:body-cell-members="props">
        <q-td :props="props">
          <span v-for="(val, key) in props.row.members" v-bind:key="val.id">
            <span v-if="key !== 0">, </span>{{val.callsign}}
            <q-tooltip class="bg-indigo text-center" :offset="[10, 10]">
              <p>{{ val['name'] }}, {{ val['callsign'].toUpperCase() }}</p>
              <p>{{ val['department'] }} {{ val['rank'] }}</p>
            </q-tooltip>
          </span>
          <unit-menu v-if="type == 'dispatch'" :unit="props.row" />
        </q-td>
      </template>

      <template v-slot:body-cell-call="props">
        <q-td :props="props">
          <template v-if="props.row.callId > 0">
            {{props.row.call.id}}

            <q-tooltip class="bg-indigo text-center" :offset="[10, 10]">
              <b>Тип</b>: {{props.row.call.type}}<br/>
              <b>Статус</b>: {{callStatusList[props.row.call.status].text}}
            </q-tooltip>
          </template>

          <template v-else>
            -
          </template>
          <unit-menu v-if="type == 'dispatch'" :unit="props.row" />
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          {{props.value}}
          <q-menu v-if="type == 'dispatch'" touch-position>
            <q-list dense style="min-width: 100px">
              <q-item
                v-for="(status, key) in unitStatusList" v-bind:key="key"
                @click="dispatchSetStatus(props.row, key)" clickable v-close-popup
              >
                <q-item-section :class="status.class">{{status.text}}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
          <!-- <unit-menu v-if="type == 'dispatch'" :unit="props.row" /> -->
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
import { callStatusList, unitStatusList } from 'src/utils/constants';
import UnitMenu from 'src/components/unit/Menu.vue';

export default {
  props: {
    type: String,
    window: Object,
  },
  components: { UnitMenu },
  setup(props) {
    const $q = useQuasar();
    const store = useStore();

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

    const dispatchSetStatus = (unit, status) => {
      socketInstance.emit('units:setStatus', { dispatch: true, unitId: unit.id, status });
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
          sortable: true,
        },
        {
          name: 'call',
          required: true,
          label: 'Прикреплённый вызов',
          align: 'center',
          sortable: true,
          field: (row) => row.call.id || 'lol',
          // format: (val, row) => row?.callData?.id || 'Нет',
        },
        {
          name: 'status',
          required: true,
          label: 'Статус',
          align: 'center',
          classes: (row) => `${row.panic ? 'text-red panic-blinking' : unitStatusList[row.status].class} text-bold`,
          // field: (row) => statuses[row.status].text,
          format: (val, row) => (row.panic ? '! ПАНИКА !' : unitStatusList[row.status].text),
          sortable: true,
        },
      ],
      list: computed(() => store.getters['unit/getAllUnits']),
      onClick,
      callStatusList,
      unitStatusList,
      dispatchSetStatus,
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
