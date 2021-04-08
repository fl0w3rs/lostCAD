<template>
    <div class="q-pa-sm">
        <q-tabs
            v-model="tab"
            class="text-teal"
        >
            <q-tab name="ncic" label="NCIC" v-if="allowedTypes.ncic" />
            <q-tab name="dmv" label="DMV" v-if="allowedTypes.dmv" />
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
                    <div class="col-5">
                      <q-input dense dark filled v-model="ncic.first" label="Имя" />
                    </div>

                    <div class="col-5">
                      <q-input dense dark filled v-model="ncic.last" label="Фамилия" />
                    </div>

                    <div class="col-2">
                      <q-btn
                        color="green" class="full-width full-height"
                        outline icon="fas fa-search" @click="requestNcic"
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
                gg
            </q-tab-panel>
        </q-tab-panels>

    </div>
</template>

<script>
/* eslint-disable eqeqeq */
import { ref, reactive } from 'vue';
import { useStore } from 'vuex';
import socket from 'src/boot/socketio-instance';

const requestId = Math.round((Date.now() / 2) * Math.random());
const ncicResults = ref([]);

export default {
  name: 'Lookup',

  props: {
    window: { type: Object, required: false, default: null },
    types: { type: Object, required: false, default: null },
  },

  setup(params) {
    const store = useStore();

    const ncic = reactive({
      first: '',
      last: '',
    });

    const requestNcic = () => {
      socket.emit('ncic/request', { data: ncic, rId: requestId });
    };

    const onNcicRowClick = (evt, row) => {
      store.commit('window/add', {
        component: 'civilian/Character', params: { type: 'view', character: row }, windowHeight: 355, title: `Просмотр ${row.name} ${row.surname}`,
      });
    };

    return {
      allowedTypes: {
        ncic: params?.types?.ncic == undefined ? true : params?.types?.ncic,
        dmv: params?.types?.dmv == undefined ? true : params?.types?.dmv,
      },

      ncic,

      requestNcic,
      onNcicRowClick,

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
          name: 'dob', align: 'center', label: 'Дата рождения', field: 'dob', sortable: false,
        },
      ],
    };
  },

  sockets: {
    'ncic/response': (data) => {
      if (data.rId != requestId) return;

      ncicResults.value = data.results;

      console.log(ncicResults.value);
    },
  },
};
</script>
