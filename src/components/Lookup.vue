<template>
    <div class="q-pa-sm text-uppercase">
        <q-tabs
          v-model="tab"
          class="bg-teal-9 text-white shadow-2 rounded-borders"
          dense
          no-caps
          inline-label
          narrow-indicator
          active-color="white"
          indicator-color="red-10"
        >
          <q-tab name="ncic" label="ПОИСК ПО ИМЕНИ" v-if="allowedTypes.ncic" />
          <q-tab name="dmv" label="ПОИСК ПО НОМЕРУ (Т/С)" v-if="allowedTypes.dmv" />
        </q-tabs>

        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-left"
          transition-next="jump-right"
          class="bg-grey-10"
        >
            <q-tab-panel name="ncic">
              <div class="row q-col-gutter-xs">
                <div class="col-4">
                  <q-input dense dark outlined v-model="ncic.first" label="Имя" />
                </div>

                <div class="col-4">
                  <q-input dense dark outlined v-model="ncic.last" label="Фамилия" />
                </div>

                <div class="col-4">
                  <q-input dense dark outlined v-model="ncic.dob" label="Дата рождения"
                    type="date" stack-label />
                </div>

                <div class="col-12">
                  <q-btn
                    color="white" class="full-width"
                    outline label="Найти" icon="fas fa-search" @click="requestNcic"
                  />
                </div>

              </div>

              <q-separator class="q-my-sm" dark />

              <q-table
                  dense
                  :rows="ncicResults"
                  :columns="ncicColumns"
                  row-key="id"
                  dark
                  v-if="ncicResults.length != 0"
                  class="shadow-0 bg-grey-10 accentBorder"
                  @row-click="onNcicRowClick"
              />
            </q-tab-panel>

            <q-tab-panel name="dmv">
              <div class="row q-col-gutter-xs">
                <div class="col-6">
                  <q-input dense dark outlined v-model="dmv.numberplate" label="Номера" />
                </div>

                <div class="col-6">
                  <q-input dense dark outlined v-model="dmv.vin" label="VIN" />
                </div>

                <div class="col-12">
                  <q-btn
                    color="white" class="full-width"
                    outline label="Найти" icon="fas fa-search" @click="requestDmv"
                  />
                </div>

              </div>

              <q-separator class="q-my-sm" dark />

              <VehicleList type="dmv" :vehicles="dmvResults" />

              <!-- <q-table
                  dense
                  :rows="dmvResults"
                  :columns="dmvColumns"
                  row-key="id"
                  dark
                  v-if="dmvResults.length != 0"
                  class="shadow-0 bg-grey-10 accentBorder"
                  @row-click="onDmvRowClick"
              /> -->
            </q-tab-panel>
        </q-tab-panels>

    </div>
</template>

<script>
/* eslint-disable eqeqeq */
import {
  ref, reactive,
  onBeforeMount, onBeforeUnmount,
} from 'vue';
import { useStore } from 'vuex';
import $socket from 'src/boot/socketio-instance';
import VehicleList from 'components/civilian/VehicleList';

import { date } from 'quasar';

export default {
  name: 'Lookup',

  components: { VehicleList },

  props: {
    window: { type: Object, required: false, default: null },
    types: { type: Object, required: false, default: null },
  },

  setup(params) {
    const store = useStore();

    const ncic = reactive({
      first: '',
      last: '',
      dob: '',
    });

    const socketWrapper = $socket.initWrapper();

    const ncicResults = ref([]);
    const dmvResults = ref([]);

    const dmv = reactive({
      numberplate: '',
      vin: '',
    });

    const requestNcic = () => {
      socketWrapper.emit('ncic/request', { data: ncic });
    };

    const requestDmv = () => {
      socketWrapper.emit('dmv/request', { data: dmv });
    };

    const onNcicRowClick = (evt, row) => {
      store.commit('window/add', {
        component: 'civilian/Character', params: { type: 'ncic', character: row }, windowHeight: 355, title: `Просмотр ${row.name} ${row.surname}`,
      });
    };

    const onDmvRowClick = (evt, row) => {
      store.commit('window/add', {
        component: 'civilian/Vehicle', params: { type: 'dmv', vehicle: row }, windowHeight: 300, title: 'Просмотр Т/С',
      });
    };

    socketWrapper.listen('ncic/response', (data) => {
      ncicResults.value = data.results;
    });

    socketWrapper.listen('dmv/response', (data) => {
      dmvResults.value = data.results;
      console.log(data.results);
    });

    onBeforeMount(socketWrapper.mount);
    onBeforeUnmount(socketWrapper.unmount);

    return {
      allowedTypes: {
        ncic: params?.types?.ncic == undefined ? true : params?.types?.ncic,
        dmv: params?.types?.dmv == undefined ? true : params?.types?.dmv,
      },

      ncic,

      requestNcic,
      onNcicRowClick,

      dmv,
      requestDmv,
      dmvResults,
      onDmvRowClick,

      tab: ref('ncic'),
      ncicResults,

      ncicColumns: [
        {
          name: 'name', align: 'center', label: 'Имя', field: 'name', sortable: false,
        },
        {
          name: 'surname', align: 'center', label: 'Фамилия', field: 'surname', sortable: false,
        },
        {
          name: 'dob',
          align: 'center',
          label: 'Дата рождения',
          field: 'dob',
          sortable: false,
          format: (val) => date.formatDate(val, 'DD.MM.YYYY'),
        },
      ],

      dmvColumns: [
        {
          name: 'numberplate', align: 'center', label: 'Номера', field: (row) => row.veh.numberplate, sortable: false,
        },
        {
          name: 'mark', align: 'center', label: 'Марка', field: (row) => row.veh.mark, sortable: false,
        },
        {
          name: 'model', align: 'center', label: 'Модель', field: (row) => row.veh.model, sortable: false,
        },
      ],
    };
  },
};
</script>
