<template>
  <div class="text-uppercase">
    <div class="q-mb-md q-gutter-xs text-right" v-if="type === 'dmv' && !hideActionButtons">
      <q-btn
        label="Выписать изъятие" color="grey" size="sm" outline icon="garage"
        @click="openImpoundmentWindow"
      />
    </div>

    <div class="text-left sectionTitle">РЕГИСТРАЦИОННАЯ ИНФОРМАЦИЯ</div>
    <div class="section rounded-borders row justify-center">
      <div class="col-6 col-md-4">
        <q-select
          :disable="disabled"
          dense
          options-dense
          square
          outlined
          v-model="info.regStatus"
          label="Статус регистрации"
          :options="vehicleRegStatusList"
        />
      </div>
      <div class="col-6 col-md-4">
        <q-input
          :disable="disabled"
          dense
          square
          type="date"
          stack-label
          outlined
          v-model="info.dor"
          label="Дата регистрации"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-select
          :disable="disabled"
          dense
          options-dense
          square
          outlined
          v-model="info.insStatus"
          label="Статус страховки"
          :options="vehicleInsStatusList"
        />
      </div>
    </div>
    <div class="q-mt-md text-left sectionTitle">ИНФОРМАЦИЯ О Т/С</div>
    <div class="section rounded-borders row justify-center">
      <div class="col-6">
        <q-select
          :disable="disabled"
          dense
          options-dense
          square
          outlined
          v-model="info.type"
          label="Тип"
          :options="vehicleTypeList"
        />
      </div>
      <div class="col-6">
        <q-select
          :disable="disabled"
          dense
          options-dense
          square
          outlined
          v-model="info.color"
          label="Цвет"
          :options="vehicleColorList"
        />
      </div>
      <div class="col-6">
        <q-select
          :disable="disabled"
          dense
          options-dense
          @filter="markFilterFn"
          square
          outlined
          v-model="info.mark"
          label="Марка"
          :options="markList"
          hide-selected
          use-input
          input-debounce="0"
          fill-input
          @input-value="onMarkUpdate"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Не найдено
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-6">
        <q-select
          :disable="disabled"
          dense
          options-dense
          square
          outlined
          v-model="info.model"
          label="Модель"
          :options="modelList"
          @filter="modelFilterFn"
          hide-selected
          use-input
          input-debounce="0"
          fill-input
          @input-value="onModelUpdate"
        />
      </div>
      <div class="col-6">
        <q-input
          :disable="disabled"
          dense
          square
          outlined
          v-model="info.numberplate"
          label="Номера"
        >
          <template v-slot:append>
            <q-btn
              round
              dense
              :disable="disabled"
              @click="randomizeNumberplate"
              flat
              icon="fas fa-random"
            />
          </template>
        </q-input>
      </div>
      <div class="col-6">
        <q-input
          :disable="true"
          dense
          square
          outlined
          v-model="info.vin"
          label="VIN"
        />
      </div>
    </div>

    <div
      class="q-mt-md text-left sectionTitle"
      v-if="type == 'dmv'"
    >
      ВЛАДЕЛЕЦ Т/С
    </div>
    <div
      class="rounded-borders row justify-center"
      v-if="type == 'dmv'"
    >
      <!-- <div
        class="col-12 q-my-sm bg-red text-white text-bold text-h6 text-center"
        v-if="character.bolo"
      >
        ВЛАДЕЛЕЦ В РОЗЫСКЕ
      </div> -->
      <div class="col-12">
        <q-btn
          :color="character.bolo ? 'red' : 'white'"
          outline
          class="full-width"
          :label="`${character.name} ${character.surname} ${character.bolo ? '[В РОЗЫСКЕ]' : ''}`"
          @click="openCharacterWindow"
        />
      </div>
    </div>

    <div
      class="full-width q-mt-md row justify-center"
      v-if="type == 'create' || type == 'edit'"
    >
      <q-btn
        v-if="type == 'create'"
        color="green"
        outline
        class="shadow-2"
        @click="create"
        icon="fas fa-plus"
        label="Создать"
      />

      <div
        class="row q-gutter-sm justify-center"
        v-if="type == 'edit'"
      >
        <q-btn
          color="green"
          outline
          class="shadow-2"
          @click="save"
          icon="fas fa-save"
          label="Сохранить"
        />
        <q-btn
          color="red"
          outline
          class="shadow-2"
          @click="remove"
          icon="fas fa-trash-alt"
          label="Удалить Т/С"
        />

      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable eqeqeq */
/* eslint-disable no-useless-return */

import {
  vehicleMarkList, vehicleRegStatusList, vehicleInsStatusList,
  vehicleColorList, vehicleTypeList,
} from 'src/utils/constants';

import {
  getRandomInt, getRandomByDict,
} from 'src/utils/functions';

import {
  watch, ref, computed,
} from 'vue';

import { useQuasar } from 'quasar';

import { SocketWrapper } from 'src/boot/socketio-instance';

import { useStore } from 'vuex';

import { generateVin } from 'vin-generator';
import { windowWrapper } from 'src/store/windows/types';

export default {
  name: 'Vehicle',

  props: {
    window: { type: Object, required: false, default: null },
    type: { type: String, required: true },
    vehicle: { type: Object, required: false, default: null },
    hideActionButtons: Boolean,
  },

  setup(props) {
    const store = useStore();
    const $q = useQuasar();

    const socketWrapper = new SocketWrapper();

    const closeWindow = () => {
      props.window.doClose();
    };

    watch(() => store.getters['characters/getSelectedCharacterId'], (val) => {
      if (val != props.vehicle.characterId) closeWindow();
    });

    const markList = ref(Object.keys(vehicleMarkList));
    const modelList = ref([]);

    const markFilterFn = (val, update) => {
      update(() => {
        const needle = val.toLowerCase();
        // eslint-disable-next-line max-len
        markList.value = Object.keys(vehicleMarkList).filter((v) => v.toLowerCase().indexOf(needle) > -1);
      });
    };

    const info = ref({ ...props.vehicle });
    if (!info.value.vin) info.value.vin = generateVin();

    watch(() => props.vehicle, (val) => {
      info.value = { ...val };
      if (!info.value.vin) info.value.vin = generateVin();
    });

    if (info.value.mark) modelList.value = vehicleMarkList[info.value.mark];

    const onMarkUpdate = (val) => {
      info.value.mark = val;

      info.value.model = '';
      modelList.value = vehicleMarkList[val];
    };

    const onModelUpdate = (val) => {
      info.value.model = val;
    };

    const modelFilterFn = (val, update) => {
      const currentModelList = vehicleMarkList[info.value.mark];

      update(() => {
        const needle = val.toLowerCase();
        // eslint-disable-next-line max-len
        modelList.value = currentModelList.filter((v) => v.toLowerCase().indexOf(needle) > -1);
      });
    };

    const create = () => {
      if (props.type != 'create') return;

      socketWrapper.emit('characters:vehicles:create', { character_owner: store.getters['characters/getSelectedCharacterId'], ...info.value });
    };
    const save = () => {
      if (props.type != 'edit') return;

      socketWrapper.emit('characters:vehicles:edit', info.value);
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
        socketWrapper.emit('characters:vehicles:remove', info.value);
      });
    };

    const randomizeNumberplate = () => {
      info.value.numberplate = getRandomInt(10, 99) + getRandomByDict(3, 'ABCDEFGHIJKLMNPQRSTUVWXYZ') + getRandomInt(100, 999);
    };

    const character = ref({});

    if (props.type == 'dmv') {
      socketWrapper.emit('lookup/requestCharacter', { id: props.vehicle.characterId }).onReturn((payload) => {
        character.value = payload.data;
      });
    }

    socketWrapper.listen('characters:vehicles:removeSuccess', () => {
      $q.notify({
        type: 'positive',
        message: 'Т/С успешно удалено',
      });
      closeWindow();
    });

    socketWrapper.listen('characters:vehicles:editSuccess', () => {
      $q.notify({
        type: 'positive',
        message: 'Т/С успешно отредактировано',
      });
    });

    socketWrapper.listen('characters:vehicles:createSuccess', () => {
      $q.notify({
        type: 'positive',
        message: 'Т/С успешно создано',
      });
      closeWindow();
    });

    const openCharacterWindow = () => {
      store.commit('windows/open', windowWrapper({
        component: 'civilian/Character',
        props: { type: 'ncic', character: character.value },
        initialWidth: '700px',
        initialHeight: '355px',
        type: 'draggable',
        title: `Просмотр ${character.value.name} ${character.value.surname}`,
      }));
    };

    const openImpoundmentWindow = () => {
      store.commit('windows/open', windowWrapper({
        type: 'dialog',
        component: 'vehicleImpoundment/Template',
        initialWidth: '50vw',
        props: {
          type: 'create',
          vehicleId: info.value.id,
        },
      }));
    };

    return {
      create,
      save,
      remove,

      markList,
      modelList,
      vehicleRegStatusList,
      vehicleInsStatusList,
      vehicleColorList,
      vehicleTypeList,

      randomizeNumberplate,

      info,

      disabled: computed(() => props.type == 'dmv'),

      character,

      markFilterFn,
      onMarkUpdate,
      modelFilterFn,
      onModelUpdate,

      openImpoundmentWindow,
      openCharacterWindow,
    };
  },
};
</script>
