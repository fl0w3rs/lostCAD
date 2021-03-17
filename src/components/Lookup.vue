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
                    :data="ncicResults"
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

export default {
  name: 'Lookup',

  props: {
    window: { type: Object, required: false, default: null },
    types: { type: Object, required: false, default: null },
  },

  data() {
    return {
      allowedTypes: {
        ncic: this?.types?.ncic == undefined ? true : this?.types?.ncic,
        dmv: this?.types?.dmv == undefined ? true : this?.types?.dmv,
      },

      tab: 'ncic',
      requestId: Math.round((Date.now() / 2) * Math.random()),
      ncic: {
        first: '',
        last: '',
      },
      ncicResults: [],

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

  methods: {
    requestNcic() {
      this.$socket.client.emit('ncic/request', { data: this.ncic, rId: this.requestId });
    },

    onNcicRowClick(evt, row) {
      this.$store.commit('window/add', {
        component: 'civilian/Character', params: { type: 'view', character: row }, windowHeight: 355, title: `Просмотр ${row.name} ${row.surname}`,
      });
    },
  },

  sockets: {
    'ncic/response': function (data) {
      if (data.rId != this.requestId) return;

      this.ncicResults = data.results;
    },
  },
};
</script>
