<template>
  <div class="q-pa-sm text-uppercase">
    <div class="text-left sectionTitle">ИНФОРМАЦИЯ О Т/С</div>
    <div class="section rounded-borders row justify-center">
      <div class="col-12 col-md-6">
        <q-select
          :disable="disabled" dense options-dense
          dark square outlined v-model="info.mark" label="Марка"
          :options="markList"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-select
          :disable="disabled || modelList.length == 0" dense options-dense
          dark square outlined v-model="info.model" label="Модель"
          :options="modelList"
        />
      </div>
      <div class="col-12">
        <q-input
          :disable="disabled" dense dark square
          outlined v-model="info.numberplate" label="Номера"
        >
          <template v-slot:append>
            <q-btn
              round dense :disable="disabled"
              @click="randomizeNumberplate" flat icon="fas fa-random"
            />
          </template>
        </q-input>
      </div>
    </div>

    <div class="q-mt-md text-left sectionTitle" v-if="type == 'dmv'">ВЛАДЕЛЕЦ Т/С</div>
    <div class="rounded-borders row justify-center" v-if="type == 'dmv'">
      <div class="col-12">
        <q-btn
          color="white" outline class="full-width"
          :label="`${character.name} ${character.surname}`"
          @click="$store.commit('window/add', {
            component: 'civilian/Character',
            params: { type: 'view', character },
            windowHeight: 355, title: `Просмотр ${character.name} ${character.surname}`,
          });"
        />
      </div>
    </div>

    <div
      class="full-width q-mt-lg row justify-center" v-if="type == 'create' || type == 'edit'"
    >
      <q-btn
        v-if="type == 'create'" color="green" outline class="shadow-2"
        @click="create" icon="fas fa-plus" label="Создать"
      />

      <div class="row q-gutter-sm justify-center" v-if="type == 'edit'">
        <q-btn
          color="green" outline class="shadow-2"
          @click="save" icon="fas fa-save" label="Сохранить"
        />
        <q-btn
          color="red" outline class="shadow-2"
          @click="remove" icon="fas fa-trash-alt" label="Удалить т/с"
        />

      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable eqeqeq */
/* eslint-disable no-useless-return */

import {
  vehicleList, getRandomInt, getRandomByDict,
} from 'src/utils.js';

import {
  watch, ref, computed,
} from 'vue';

import { useQuasar } from 'quasar';

import $socket from 'src/boot/socketio-instance';

import { useStore } from 'vuex';

let store;
let $q;

let closeWindow;

export default {
  name: 'Vehicle',

  props: {
    window: { type: Object, required: false, default: null },
    type: { type: String, required: true },
    vehicle: { type: Object, required: false, default: null },
    character: { type: Object, required: false, default: null },
  },

  sockets: {
    'user/civilian/characters/vehicles/removeSuccess': () => {
      $q.notify({
        type: 'positive',
        message: 'Т/С успешно удалено',
        position: 'top',
      });
      closeWindow();
    },

    'user/civilian/characters/vehicles/editSuccess': () => {
      $q.notify({
        type: 'positive',
        message: 'Т/С успешно отредактировано',
        position: 'top',
      });
    },

    'user/civilian/characters/vehicles/createSuccess': () => {
      $q.notify({
        type: 'positive',
        message: 'Т/С успешно создано',
        position: 'top',
      });
      closeWindow();
    },
  },

  setup(props) {
    store = useStore();
    $q = useQuasar();

    closeWindow = () => {
      store.commit('window/close', props.window.id);
    };

    watch(() => store.getters['characters/getSelectedCharacterId'], (val) => {
      if (val != props.vehicle.character_id) closeWindow();
    });

    const markList = Object.keys(vehicleList);
    const modelList = ref([]);

    const info = ref({ ...props.vehicle });

    watch(props.vehicle, (val) => {
      info.value = { ...val };
    });

    if (info.value.mark) modelList.value = vehicleList[info.value.mark];
    watch(() => info.value.mark, (val) => {
      modelList.value = vehicleList[val];
      info.value.model = '';
    });

    const create = () => {
      if (props.type != 'create') return;

      $socket.emit('user/civilian/characters/vehicles/create', { character_owner: store.getters['characters/getSelectedCharacterId'], ...info.value });
    };
    const save = () => {
      if (props.type != 'edit') return;

      $socket.emit('user/civilian/characters/vehicles/edit', info.value);
    };
    const remove = () => {
      if (props.type != 'edit') return;

      $q.dialog({
        dark: true,
        title: 'Подтверждение',
        message: 'Вы уверены, что хотите удалить это Т/С?',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        $socket.emit('user/civilian/characters/vehicles/remove', info.value);
      });
    };

    const randomizeNumberplate = () => {
      info.value.numberplate = getRandomInt(10, 99) + getRandomByDict(3, 'ABCDEFGHIJKLMNPQRSTUVWXYZ') + getRandomInt(100, 999);
    };

    return {
      create,
      save,
      remove,

      markList,
      modelList,

      randomizeNumberplate,

      info,

      disabled: computed(() => props.type == 'dmv'),
    };
  },
};
</script>
