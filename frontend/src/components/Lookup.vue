<template>
  <div class="text-uppercase">
    <q-tabs
      v-model="tab"
      class="bg-teal-9 shadow-2 rounded-borders"
      dense
      no-caps
      inline-label
      narrow-indicator
      active-color="white"
      indicator-color="red-10"
    >
      <q-tab
        name="ncic"
        label="ПОИСК ПО ИМЕНИ"
        v-if="allowedTypes.ncic"
      />
      <q-tab
        name="dmv"
        label="ПОИСК ПО НОМЕРУ (Т/С)"
        v-if="allowedTypes.dmv"
      />
      <q-tab
        name="fld"
        label="ПОИСК ПО ОРУЖИЮ"
        v-if="allowedTypes.fld"
      />
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
            <q-input
              dense
              outlined
              v-model="ncic.first"
              label="Имя"
              @keyup.enter="requestNcic"
            />
          </div>

          <div class="col-4">
            <q-input
              dense
              outlined
              v-model="ncic.last"
              label="Фамилия"
              @keyup.enter="requestNcic"
            />
          </div>

          <div class="col-4">
            <q-input
              dense
              outlined
              v-model="ncic.dob"
              label="Дата рождения"
              type="date"
              stack-label
              @keyup.enter="requestNcic"
            />
          </div>

          <div class="col-12">
            <q-btn
              color="white"
              class="full-width"
              outline
              label="Найти"
              icon="fas fa-search"
              @click="requestNcic"
            />
          </div>
        </div>

        <q-separator
          class="q-my-sm"
        />

        <div class="text-left sectionTitle">СПИСОК ПЕРСОНАЖЕЙ</div>
        <div class="section rounded-borders row justify-center">
          <q-table
            dense
            :rows="ncicResults.characters"
            :columns="ncicColumns"
            row-key="id"
            class="shadow-0 bg-grey-10 accentBorder full-width"
            @row-click="onNcicRowClick"
          />
        </div>

        <div
          class="text-left sectionTitle q-mt-md"
          v-if="ncicResults?.weapons?.length > 0 || ncicResults?.vehicles?.length > 0"
        >ЗАПИСИ</div>
        <q-card
          class="section rounded-borders"
          v-if="ncicResults?.weapons?.length > 0 || ncicResults?.vehicles?.length > 0"
        >
          <q-tabs
            v-model="ncicTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab
              name="vehicles" :label="`ТРАНСПОРТНОЕ СРЕДСТВО (${ncicResults?.vehicles?.length})`"
              v-if="ncicResults?.vehicles?.length > 0"
            />
            <q-tab
              name="weapons" :label="`ОРУЖИЕ (${ncicResults?.weapons?.length})`"
              v-if="ncicResults?.weapons?.length > 0"
            />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="ncicTab" animated>
            <q-tab-panel name="vehicles">
              <VehicleList
                type="dmv"
                showOwners="true"
                :vehicles="ncicResults.vehicles"
              />
            </q-tab-panel>

            <q-tab-panel name="weapons">
              <WeaponList
                type="fld"
                showOwners="true"
                :weapons="ncicResults.weapons"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="dmv">
        <div class="row q-col-gutter-xs">
          <div class="col-6">
            <q-input
              dense
              outlined
              v-model="dmv.numberplate"
              label="Номера"
              @keyup.enter="requestDmv"
            />
          </div>

          <div class="col-6">
            <q-input
              dense
              outlined
              v-model="dmv.vin"
              label="VIN"
              @keyup.enter="requestDmv"
            />
          </div>

          <div class="col-12">
            <q-btn
              color="white"
              class="full-width"
              outline
              label="Найти"
              icon="fas fa-search"
              @click="requestDmv"
            />
          </div>
        </div>

        <q-separator
          class="q-my-sm"
        />

        <VehicleList
          type="dmv"
          :vehicles="dmvResults"
        />
      </q-tab-panel>

      <q-tab-panel name="fld">
        <div class="row q-col-gutter-xs">
          <div class="col-12">
            <q-input
              dense
              outlined
              v-model="fld.serial"
              label="Серийный номер"
              @keyup.enter="requestFld"
            />
          </div>

          <div class="col-12">
            <q-btn
              color="white"
              class="full-width"
              outline
              label="Найти"
              icon="fas fa-search"
              @click="requestFld"
            />
          </div>
        </div>

        <q-separator
          class="q-my-sm"
        />

        <WeaponList
          type="fld"
          :weapons="fldResults"
        />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
/* eslint-disable eqeqeq */
import {
  ref, reactive,
} from 'vue';
import { useStore } from 'vuex';
import { SocketWrapper } from 'src/boot/socketio-instance';
import VehicleList from 'components/vehicle/List';
import WeaponList from 'components/weapon/List';

import { date } from 'quasar';

export default {
  name: 'Lookup',

  components: { VehicleList, WeaponList },

  props: {
    window: { type: Object, required: false, default: null },
    types: { type: Object, required: false, default: null },
  },

  setup(params) {
    const store = useStore();

    const socketWrapper = new SocketWrapper();

    //

    const ncic = reactive({
      first: '',
      last: '',
      dob: '',
    });

    const ncicResults = ref({});

    const requestNcic = () => {
      socketWrapper.emit('ncic/request', { data: ncic });
    };

    const onNcicRowClick = (evt, row) => {
      store.commit('window/add', {
        component: 'civilian/Character',
        params: { type: 'ncic', character: row },
        windowHeight: 355,
        title: `Просмотр ${row.name} ${row.surname}`,
      });
    };

    socketWrapper.listen('ncic/response', (data) => {
      ncicResults.value = data;
    });

    //

    const fld = reactive({
      serial: '',
    });

    const fldResults = ref([]);

    const requestFld = () => {
      socketWrapper.emit('fld/request', { data: fld });
    };

    socketWrapper.listen('fld/response', (data) => {
      fldResults.value = data.results;
    });

    //

    const dmv = reactive({
      numberplate: '',
      vin: '',
    });

    const dmvResults = ref([]);

    const requestDmv = () => {
      socketWrapper.emit('dmv/request', { data: dmv });
    };

    socketWrapper.listen('dmv/response', (data) => {
      dmvResults.value = data.results;
    });

    return {
      allowedTypes: {
        ncic: params?.types?.ncic == undefined ? true : params?.types?.ncic,
        dmv: params?.types?.dmv == undefined ? true : params?.types?.dmv,
        fld: params?.types?.fld == undefined ? true : params?.types?.fld,
      },

      ncic,
      requestNcic,
      ncicResults,
      onNcicRowClick,

      dmv,
      requestDmv,
      dmvResults,

      fld,
      requestFld,
      fldResults,

      tab: ref('ncic'),
      ncicTab: ref(null),

      ncicColumns: [
        {
          name: 'name',
          align: 'center',
          label: 'Имя',
          field: 'name',
          sortable: false,
        },
        {
          name: 'surname',
          align: 'center',
          label: 'Фамилия',
          field: 'surname',
          sortable: false,
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
    };
  },
};
</script>
