<template>
  <div class="text-uppercase">
    <!-- <div class="text-left sectionTitle">РЕГИСТРАЦИОННАЯ ИНФОРМАЦИЯ</div>
    <div class="section rounded-borders row justify-center">
      <div class="col-6 col-md-4">
        <q-select
          :disable="disabled" dense options-dense
          dark square outlined v-model="info.regStatus" label="Статус регистрации"
          :options="vehicleRegStatusList"
        />
      </div>
      <div class="col-6 col-md-4">
        <q-input
          :disable="disabled" dense dark square type="date" stack-label
          outlined v-model="info.dor" label="Дата регистрации"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-select
          :disable="disabled" dense options-dense
          dark square outlined v-model="info.insStatus" label="Статус страховки"
          :options="vehicleInsStatusList"
        />
      </div>
    </div> -->
    <div class="text-left sectionTitle">ИНФОРМАЦИЯ ОБ ОРУЖИИ</div>
    <div class="section rounded-borders row justify-center">
      <div class="col-6">
        <q-select
          :disable="disabled" dense options-dense
          dark square outlined v-model="info.regStatus" label="Статус регистрации"
          :options="weaponRegStatusList"
        />
      </div>
      <div class="col-6">
        <q-input
          :disable="true" dense options-dense
          dark square outlined v-model="info.serial" label="Серийный номер"
        />
      </div>
      <div class="col-12">
        <q-select
          :disable="disabled" dense options-dense
          dark square outlined v-model="info.model" label="Модель"
          :options="weaponModelList"
        />
      </div>
    </div>

    <div class="q-mt-md text-left sectionTitle" v-if="type == 'fld'">ВЛАДЕЛЕЦ ОРУЖИЯ</div>
    <div class="rounded-borders row justify-center" v-if="type == 'fld'">
      <div class="col-12">
        <q-btn
          color="white" outline class="full-width"
          :label="`${character.name} ${character.surname}`"
          @click="$store.commit('window/add', {
            component: 'civilian/Character',
            params: { type: 'ncic', character },
            windowHeight: 355, title: `Просмотр ${character.name} ${character.surname}`,
          });"
        />
      </div>
    </div>

    <div
      class="full-width q-mt-md row justify-center" v-if="type == 'create' || type == 'edit'"
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
          @click="remove" icon="fas fa-trash-alt" label="Удалить"
        />

      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable eqeqeq */
/* eslint-disable no-useless-return */

import {
  watch, ref, computed, onBeforeMount, onBeforeUnmount,
} from 'vue';

import { weaponModelList, weaponRegStatusList, randomString } from 'src/utils.js';

import { useQuasar } from 'quasar';

import $socket from 'src/boot/socketio-instance';

import { useStore } from 'vuex';

export default {
  name: 'Weapon',

  props: {
    window: { type: Object, required: false, default: null },
    type: { type: String, required: true },
    weapon: { type: Object, required: false, default: null },
  },

  setup(props) {
    const store = useStore();
    const $q = useQuasar();

    const socketWrapper = $socket.initWrapper();

    const closeWindow = () => {
      store.commit('window/close', props.window.id);
    };

    socketWrapper.listen('user/civilian/characters/weapons/removeSuccess', () => {
      $q.notify({
        type: 'positive',
        message: 'Оружие успешно удалено',
        position: 'top',
      });
      closeWindow();
    });

    socketWrapper.listen('user/civilian/characters/weapons/editSuccess', () => {
      $q.notify({
        type: 'positive',
        message: 'Оружие успешно отредактировано',
        position: 'top',
      });
    });

    socketWrapper.listen('user/civilian/characters/weapons/createSuccess', () => {
      $q.notify({
        type: 'positive',
        message: 'Оружие успешно создано',
        position: 'top',
      });
      closeWindow();
    });

    watch(() => store.getters['characters/getSelectedCharacterId'], (val) => {
      if (val != props.weapon.characterId) closeWindow();
    });

    const info = ref({ ...props.weapon });

    watch(() => props.weapon, (val) => {
      info.value = { ...val };
    });

    const create = () => {
      if (props.type != 'create') return;

      socketWrapper.emit('user/civilian/characters/weapons/create', { character_owner: store.getters['characters/getSelectedCharacterId'], ...info.value });
    };
    const save = () => {
      if (props.type != 'edit') return;

      socketWrapper.emit('user/civilian/characters/weapons/edit', info.value);
    };
    const remove = () => {
      if (props.type != 'edit') return;

      $q.dialog({
        dark: true,
        title: 'Подтверждение',
        message: 'Вы уверены, что хотите удалить это оружие?',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        socketWrapper.emit('user/civilian/characters/weapons/remove', info.value);
      });
    };

    const character = ref({});

    if (props.type == 'fld') {
      socketWrapper.emit('fld/requestOwner', { id: props.vehicle.id });
      socketWrapper.listen('fld/responseOwner', (payload) => {
        character.value = payload.data;
      });
    }

    onBeforeMount(socketWrapper.mount);
    onBeforeUnmount(socketWrapper.unmount);

    onBeforeMount(() => {
      if (!info.value.serial) info.value.serial = randomString(10, 'A#');
    });

    return {
      disabled: computed(() => props.type == 'fld'),
      character,

      create,
      save,
      remove,

      weaponModelList,
      weaponRegStatusList,

      info,
    };
  },
};
</script>
