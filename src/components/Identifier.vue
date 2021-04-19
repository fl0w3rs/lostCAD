<template>
  <div>
    <div v-if="!selectedIdentifier">
      <div class="row q-col-gutter-sm">
        <div class="col-12">
          <q-table
            dense
            :rows="allIdentifiers"
            :columns="columns"
            row-key="id"
            dark
            class="shadow-0 bg-grey-10 accentBorder"
            @row-click="onSelectIdentifier"
          />
        </div>

        <div class="col-12">
          <q-btn label="Создать новый" outline class="full-width"
          color="green" @click="createIdentifier"></q-btn>
        </div>
      </div>

    </div>

    <div v-else>
      <div class="row q-col-gutter-sm">
        <div class="col-6">
          <q-input dense dark filled v-model="currentIdentifier.name" label="Имя" />
        </div>
        <div class="col-6">
          <q-input dense dark filled v-model="currentIdentifier.callsign" label="Позывной" />
        </div>
        <div class="col-12">
          <q-input dense dark filled v-model="currentIdentifier.rank" label="Звание" />
        </div>

        <div class="col-6">
          <q-btn label="Сохранить" outline class="full-width"
            color="green" @click="saveIdentifier"></q-btn>

        </div>

        <div class="col-6">
          <q-btn label="Удалить" outline class="full-width"
            color="red" @click="deleteIdentifier"></q-btn>

        </div>

        <div class="col-12">
          <q-btn label="Сменить идентификатор" outline class="full-width"
            color="orange" @click="changeIdentifier"></q-btn>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import {
  computed,
  ref,
  watch,
  onMounted,
} from 'vue';
import $socket from 'src/boot/socketio-instance';
import { useQuasar } from 'quasar';

let store;
let $q;

export default {
  sockets: {
    'user/identifiers/createSuccess': (payload) => {
      store.commit('identifier/selectIdentifier', payload.id);
    },

    'user/identifiers/editSuccess': () => {
      $q.notify({
        type: 'positive',
        message: 'Идентификатор успешно отредактирован',
        position: 'top',
      });
    },
  },

  setup() {
    store = useStore();
    $q = useQuasar();

    const selectedIdentifier = computed(() => store.getters['identifier/getSelectedIdentifierObject']);

    const currentIdentifier = ref({});

    watch(selectedIdentifier, (newval) => {
      currentIdentifier.value = { ...newval };
    });

    const changeIdentifier = () => {
      store.commit('identifier/selectIdentifier', null);
    };

    const createIdentifier = () => {
      $socket.emit('user/identifiers/create', []);
    };

    const onSelectIdentifier = (evt, row) => {
      store.commit('identifier/selectIdentifier', row.id);
    };

    const deleteIdentifier = () => {
      $socket.emit('user/identifiers/delete', currentIdentifier.value.id);
      changeIdentifier();
    };

    const saveIdentifier = () => {
      $socket.emit('user/identifiers/edit', currentIdentifier.value);
    };

    onMounted(() => {
      store.dispatch('identifier/request');
      currentIdentifier.value = { ...store.getters['identifier/getSelectedIdentifierObject'] };
    });

    return {
      selectedIdentifier,
      allIdentifiers: computed(() => store.getters['identifier/getAllIdentifiers']),
      currentIdentifier,

      changeIdentifier,
      createIdentifier,
      onSelectIdentifier,

      deleteIdentifier,
      saveIdentifier,

      columns: [
        {
          name: 'name', align: 'center', label: 'Имя', field: 'name', sortable: false,
        },
        {
          name: 'callsign', align: 'center', label: 'Позывной', field: 'callsign', sortable: false,
        },
      ],
    };
  },
};
</script>
