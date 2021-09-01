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
      v-if="!searchMode"
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
          >
            <template v-slot:body-cell-isWanted="props">
              <q-td :props="props">
                <div class="column justify-center q-gutter-xs">
                  <span>
                    <q-badge label="В РОЗЫСКЕ" color="red" v-if="props.row.bolo" />
                  </span>
                  <span
                    v-for="flag in Object.entries(props.row.boloFlags).filter((val) => !!val[1])"
                    :key="flag[0]"
                  >
                    <q-badge
                      color="red"
                      :label="boloFlagList[flag[0]] || flag[0]"
                    ></q-badge>
                  </span>

                </div>
              </q-td>
            </template>
          </q-table>
        </div>

        <template
          v-if="
            (ncicResults?.weapons?.length > 0 || ncicResults?.vehicles?.length > 0)
            && (allowedTypes.fld || allowedTypes.dmv)
            && !searchMode
          "
        >
          <div
            class="text-left sectionTitle q-mt-md"
          >ЗАПИСИ</div>
          <q-card
            class="section rounded-borders"
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
                v-if="ncicResults?.vehicles?.length > 0 && allowedTypes.dmv"
              />
              <q-tab
                name="weapons" :label="`ОРУЖИЕ (${ncicResults?.weapons?.length})`"
                v-if="ncicResults?.weapons?.length > 0 && allowedTypes.fld"
              />
              <q-tab
                name="arrests" :label="`АРЕСТЫ (${ncicResults?.arrests?.length})`"
                v-if="ncicResults?.arrests?.length > 0"
              />
              <q-tab
                name="citations" :label="`ШТРАФЫ (${ncicResults?.citations?.length})`"
                v-if="ncicResults?.citations?.length > 0"
              />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="ncicTab" animated>
              <q-tab-panel name="vehicles">
                <VehicleList
                  type="dmv"
                  :showOwners="true"
                  :vehicles="ncicResults.vehicles"
                />
              </q-tab-panel>

              <q-tab-panel name="weapons">
                <WeaponList
                  type="fld"
                  :showOwners="true"
                  :weapons="ncicResults.weapons"
                />
              </q-tab-panel>

              <q-tab-panel name="arrests">
                <arrest-list
                  :arrestList="ncicResults.arrests"
                  dense
                />
              </q-tab-panel>

              <q-tab-panel name="citations">
                <citation-list
                  :citationList="ncicResults.citations"
                  dense
                />
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </template>
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
          :onRowClickOverwrite="onDmvRowClick"
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
import CitationList from 'components/citations/List';
import ArrestList from 'components/arrests/List';
import { boloFlagList } from 'src/utils/constants';

import { date } from 'quasar';
import { windowWrapper } from 'src/store/windows/types';

export default {
  name: 'Lookup',

  components: {
    VehicleList, WeaponList, CitationList, ArrestList,
  },

  props: {
    window: { type: Object, required: false, default: null },
    types: { type: Object, required: false, default: null },
    searchMode: Boolean,
    defaultTab: String,
    closeOnOverwriteCall: Boolean,
    onNcicRowClickOverwrite: Function,
    onDmvRowClickOverwrite: Function,
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
      socketWrapper.emit('lookup:ncic', { data: ncic }).onReturn((data) => {
        ncicResults.value = data;
      });
    };

    const onNcicRowClick = params?.onNcicRowClickOverwrite ? ((evt, row) => {
      if (params?.closeOnOverwriteCall) params.window.doClose();
      params.onNcicRowClickOverwrite(evt, row);
    }) : ((evt, row) => {
      store.commit('windows/open', windowWrapper({
        component: 'civilian/Character',
        type: 'draggable',
        initialHeight: '700px',
        initialWidth: '50vw',
        title: `Просмотр ${row.name} ${row.surname}`,
        props: { type: 'ncic', character: row },
      }));
    });

    //

    const fld = reactive({
      serial: '',
    });

    const fldResults = ref([]);

    const requestFld = () => {
      socketWrapper.emit('lookup:fld', { data: fld }).onReturn((data) => {
        fldResults.value = data.results;
      });
    };

    //

    const dmv = reactive({
      numberplate: '',
      vin: '',
    });

    const dmvResults = ref([]);

    const requestDmv = () => {
      socketWrapper.emit('lookup:dmv', { data: dmv }).onReturn((data) => {
        dmvResults.value = data.results;
      });
    };

    const onDmvRowClick = params?.onDmvRowClickOverwrite ? (evt, row) => {
      if (params?.closeOnOverwriteCall) params.window.doClose();
      params.onDmvRowClickOverwrite(evt, row);
    } : null;

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
      onDmvRowClick,

      fld,
      requestFld,
      fldResults,

      tab: ref(params?.defaultTab || 'ncic'),
      ncicTab: ref(null),
      boloFlagList,

      ncicColumns: [
        {
          name: 'isWanted',
        },
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
