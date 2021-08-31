<template>
  <div class="text-uppercase">
    <div class="q-mb-md q-gutter-xs text-right" v-if="type === 'ncic' && !hideActionButtons">
      <q-btn
        label="Выписать штраф" color="grey" size="sm" outline icon="fas fa-ticket-alt"
        @click="openTicketWindow"
      />
    </div>
    <div class="text-left sectionTitle">ИЗОБРАЖЕНИЕ ПЕРСОНАЖА</div>
    <div class="section rounded-borders row justify-center">
      <div class="col-12 text-center">
        <q-img
          :src="info.image"
          spinner-color="white"
          style="max-height: 300px; max-width: 300px"
        />
        <q-input
          :disable="disable"
          dense
          square
          outlined
          v-model="info.image"
          v-if="type !== 'ncic'"
          label="Ссылка на изображение"
        />
      </div>
    </div>
    <div class="q-mt-md text-left sectionTitle">ИНФОРМАЦИЯ О ПЕРСОНАЖЕ</div>
    <div class="section rounded-borders row justify-center">
      <div class="col-6 col-md-3">
        <q-input
          :disable="disable"
          dense
          square
          outlined
          v-model="info.name"
          label="Имя"
        />
      </div>
      <div class="col-6 col-md-3">
        <q-input
          :disable="disable"
          dense
          square
          outlined
          v-model="info.surname"
          label="Фамилия"
        />
      </div>
      <div class="col-6 col-md-4">
        <q-input
          :disable="disable"
          type="date"
          stack-label
          dense
          square
          outlined
          v-model="info.dob"
          label="Дата рождения"
        />
      </div>
      <div class="col-6 col-md-2">
        <q-input
          :disable="true"
          dense
          square
          outlined
          v-model="age"
          label="Возраст"
        />
      </div>
      <div class="col-6 col-md-4">
        <q-select
          :disable="disable"
          dense
          options-dense
          square
          outlined
          v-model="info.sex"
          label="Пол"
          :options="sexList"
        />
      </div>

      <div class="col-6 col-md-2">
        <q-input
          :disable="disable"
          dense
          square
          outlined
          v-model="info.height"
          label="Рост"
        />
      </div>
      <div class="col-6 col-md-2">
        <q-input
          :disable="disable"
          dense
          square
          outlined
          v-model="info.weight"
          label="Вес"
        />
      </div>
      <div class="col-6 col-md-4">
        <q-select
          :disable="disable"
          dense
          options-dense
          square
          outlined
          v-model="info.race"
          label="Раса"
          :options="raceList"
        />
      </div>
      <div class="col-6 col-md-3">
        <q-select
          :disable="disable"
          dense
          options-dense
          square
          outlined
          v-model="info.eyeColor"
          label="Цвет глаз"
          :options="eyeColorList"
        />
      </div>
      <div class="col-6 col-md-3">
        <q-select
          :disable="disable"
          dense
          options-dense
          square
          outlined
          v-model="info.hairColor"
          label="Цвет волос"
          :options="hairColorList"
        />
      </div>

      <div class="col-6">
        <q-input
          :disable="disable"
          dense
          square
          outlined
          v-model="info.placeOfWork"
          label="Место работы"
        />
      </div>
      <div class="col-6">
        <q-select
          :disable="disable"
          dense
          options-dense
          square
          outlined
          v-model="info.residenceAddress"
          label="Адрес проживания"
          :options="streetListFiltered"
          use-input
          input-debounce="0"
          @filter="streetFilterFn"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">Не найдено</q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div :class="type === 'ncic' ? 'col-md-6' : 'col-md-2'" class="col-6">
        <q-input
          :disable="disable"
          type="number"
          dense
          square
          outlined
          v-model.number="info.blockNumber"
          label="Номер блока"
        />
      </div>
      <div class="col-6 col-md-4" v-if="type !== 'ncic'">
        <q-input
          :disable="disable"
          dense
          square
          outlined
          v-model="info.description"
          label="Краткое описание"
        />
      </div>
    </div>

    <template v-if="!hideLic">
      <div class="text-left sectionTitle q-mt-md">ИНФОРМАЦИЯ О ЛИЦЕНЗИЯХ</div>
      <div class="section rounded-borders row justify-center">
        <div class="col-6">
          <q-select
            :disable="disable"
            dense
            options-dense
            square
            outlined
            v-model="info.gunLicense"
            label="Лицензия на оружие"
            :options="licenseOptionList"
          />
        </div>
        <div class="col-6">
          <q-select
            :disable="disable"
            dense
            options-dense
            square
            outlined
            v-model="info.hiddenGunLicense"
            label="Лицензия на скрытое ношение оружия"
            :options="licenseOptionList"
          />
        </div>
        <div class="col-6 col-md-4">
          <q-select
            :disable="disable"
            dense
            options-dense
            square
            outlined
            v-model="info.driverLicense"
            label="Лицензия на вождение"
            :options="licenseOptionList"
          />
        </div>
        <div class="col-6 col-md-4">
          <q-select
            :disable="disable"
            dense
            options-dense
            square
            outlined
            v-model="info.pilotLicense"
            label="Лицензия пилота"
            :options="licenseOptionList"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-select
            :disable="disable"
            dense
            options-dense
            square
            outlined
            v-model="info.boatLicense"
            label="Лодочная лицензия"
            :options="licenseOptionList"
          />
        </div>
      </div>
    </template>

    <template v-if="!hideMed">
      <div class="text-left sectionTitle q-mt-md">МЕДИЦИНСКАЯ КАРТА</div>
      <div class="section rounded-borders row justify-center">
        <div class="col-6 col-md-4">
          <q-select
            :disable="disable"
            dense
            options-dense
            square
            outlined
            v-model="info.bloodType"
            label="Группа крови"
            :options="bloodTypeList"
          />
        </div>

        <div class="col-6 col-md-4">
          <q-select
            :disable="disable"
            dense
            options-dense
            square
            outlined
            v-model="info.rhesusFactor"
            label="Резус-фактор"
            :options="rhesusFactorList"
          />
        </div>

        <div class="col-5 col-md-4">
          <q-select
            :disable="disable"
            dense
            options-dense
            square
            outlined
            v-model="info.invalidity"
            label="Инвалидность"
            :options="invalidityList"
          />
        </div>

        <div class="col-7 col-md-12">
          <q-input
            :disable="disable"
            dense
            square
            outlined
            v-model="info.chronicDiseases"
            label="Хронические болезни"
          />
        </div>
      </div>
    </template>

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
          @click="edit"
          icon="fas fa-save"
          label="Сохранить"
        />
        <q-btn
          color="red"
          outline
          class="shadow-2"
          @click="remove"
          icon="fas fa-trash-alt"
          label="Удалить персонажа"
        />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable eqeqeq */

import {
  sexList,
  raceList,
  eyeColorList,
  hairColorList,
  streetList,
  bloodTypeList,
  rhesusFactorList,
  invalidityList,
  licenseOptionList,
} from 'src/utils/constants';

import { getRandomArrayItem, toTitleCase } from 'src/utils/functions';

import { useQuasar } from 'quasar';

import { SocketWrapper } from 'src/boot/socketio-instance';

import { useStore } from 'vuex';

import {
  ref, watch, computed,
} from 'vue';
import { windowWrapper } from 'src/store/windows/types';

export default {
  name: 'Character',

  props: {
    window: { type: Object, required: false, default: null },
    type: { type: String, required: true },
    character: { type: Object, required: false, default: null },
    hideMed: Boolean,
    hideLic: Boolean,
    hideActionButtons: Boolean,
  },

  setup(props) {
    const store = useStore();
    const $q = useQuasar();

    const socketWrapper = new SocketWrapper();

    const info = ref({ ...props.character });
    watch(
      () => props.character,
      (val) => {
        info.value = { ...val };
      },
    );

    if (props.type == 'ncic') info.value.description = 'СКРЫТО';

    const disable = props.type == 'view' || props.type == 'ncic';

    const age = computed(() => {
      const diffTime = Date.now() - new Date(info.value.dob);
      const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
      return diffYears || 0;
    });

    const normalizeInfo = () => {
      if (props.type != 'create' && props.type != 'edit') return;

      if (!info.value.placeOfWork) info.value.placeOfWork = 'Безработный';
      if (!info.value.residenceAddress) info.value.residenceAddress = 'Не прописан';
      if (!info.value.bloodType) info.value.bloodType = getRandomArrayItem(bloodTypeList);

      if (!info.value.rhesusFactor) {
        info.value.rhesusFactor = getRandomArrayItem(rhesusFactorList);
      }

      if (!info.value.invalidity) info.value.invalidity = 'Отсутствует';
      if (!info.value.chronicDiseases) info.value.chronicDiseases = 'Отсутствуют';

      if (!info.value.description) info.value.description = '';

      info.value.name = toTitleCase(info.value.name);
      info.value.surname = toTitleCase(info.value.surname);
    };

    const create = () => {
      if (props.type != 'create') return;

      normalizeInfo();

      socketWrapper.emit('characters:create', info.value);
    };

    const edit = () => {
      if (props.type != 'edit') return;

      normalizeInfo();

      socketWrapper.emit('characters:edit', info.value);
    };

    const remove = () => {
      if (props.type != 'edit') return;

      $q.dialog({
        dark: true,
        title: 'Подтверждение',
        message: 'Вы уверены, что хотите удалить персонажа?',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        socketWrapper.emit('characters:delete', {
          id: props.character.id,
        });
      });
    };

    const streetListFiltered = ref(streetList);

    const streetFilterFn = (val, update) => {
      if (val === '') {
        update(() => {
          streetListFiltered.value = streetList;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        streetListFiltered.value = streetList.filter((v) => v.toLowerCase().indexOf(needle) > -1);
      });
    };

    socketWrapper.listen('characters:createSuccess', () => {
      if (props.type != 'create') return;

      $q.notify({
        type: 'positive',
        message: 'Персонаж успешно создан.',
      });
      props.window.doClose();
    });

    socketWrapper.listen('characters:editSuccess', () => {
      if (props.type != 'edit') return;

      $q.notify({
        type: 'positive',
        message: 'Персонаж успешно отредактирован.',
      });
      props.window.doClose();
    });

    socketWrapper.listen('characters:deleteSuccess', () => {
      if (props.type != 'edit') return;

      $q.notify({
        type: 'positive',
        message: 'Персонаж успешно удалён.',
      });
      store.commit('characters/updateSelected', null);
      props.window.doClose();
    });

    const openTicketWindow = () => {
      store.commit('windows/open', windowWrapper({
        type: 'dialog',
        component: 'citations/Template',
        initialWidth: '50vw',
        props: {
          type: 'create',
          characterId: info.value.id,
        },
      }));
    };

    return {
      info,

      sexList,
      raceList,
      eyeColorList,
      hairColorList,

      bloodTypeList,
      rhesusFactorList,
      invalidityList,

      streetListFiltered,

      disable,
      age,

      create,
      edit,
      remove,

      streetFilterFn,
      licenseOptionList,

      openTicketWindow,
    };
  },
};
</script>
