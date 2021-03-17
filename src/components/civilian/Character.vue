<template>
    <div class="q-pa-sm text-uppercase">
        <div class="text-left sectionTitle">ИНФОРМАЦИЯ О ПЕРСОНАЖЕ</div>
        <div class="section rounded-borders row justify-center">
            <div class="col-6 col-md-3">
              <q-input
                :disable="disable" dense dark square outlined v-model="info.name" label="Имя"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                :disable="disable" dense dark square
                outlined v-model="info.surname" label="Фамилия"
              />
            </div>
            <div class="col-6 col-md-4">
              <q-input
                :disable="disable" type="date" stack-label
                dense dark square outlined v-model="info.dob"
                label="Дата рождения"
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input
                :disable="true" dense dark square
                outlined v-model="age" label="Возраст"
              />
            </div>
            <div class="col-6 col-md-4">
              <q-select
                :disable="disable" dense options-dense
                dark square outlined v-model="info.sex" label="Пол"
                emit-value map-options :options="sexList"
              />
            </div>

            <div class="col-6 col-md-2">
              <q-input
                :disable="disable" dense dark square
                outlined v-model="info.height" label="Рост"
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input
                :disable="disable" dense dark square
                outlined v-model="info.weight" label="Вес"
              />
            </div>
            <div class="col-6 col-md-4">
              <q-select
                :disable="disable" dense options-dense dark square
                outlined v-model="info.race" label="Раса"
                emit-value map-options :options="raceList"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-select
                :disable="disable" dense options-dense dark square
                outlined v-model="info.eyeColor" label="Цвет глаз"
                emit-value map-options :options="eyeColorList"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-select
                :disable="disable" dense options-dense dark square
                outlined v-model="info.hairColor" label="Цвет волос"
                emit-value map-options :options="hairColorList"
              />
            </div>

            <div class="col-6">
              <q-input
                :disable="disable" dense dark square outlined
                v-model="info.placeOfWork" label="Место работы"
              />
            </div>
            <div class="col-6">

                <q-select
                  :disable="disable" dense options-dense dark square
                  outlined v-model="info.residenceAddress" label="Адрес проживания"
                  :options="streetList" use-input input-debounce="0"
                  @filter="streetFilterFn"
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
            <div class="col-6 col-md-2">
                <q-input
                  :disable="disable" type="number" dense dark square
                  outlined v-model.number="info.blockNumber" label="Номер блока"
                />
            </div>
            <div class="col-6 col-md-4">
              <q-input
                :disable="disable" dense dark square
                outlined v-model="info.description" label="Краткое описание"
              />
            </div>
        </div>

        <div class="text-left sectionTitle q-mt-md">МЕДИЦИНСКАЯ КАРТА</div>
        <div class="section rounded-borders row justify-center">
            <div class="col-6 col-md-4">
                <q-select
                  :disable="disable" dense options-dense dark square
                  outlined v-model="info.bloodType" label="Группа крови"
                  emit-value map-options :options="bloodTypeList"
                />
            </div>

            <div class="col-6 col-md-4">
                <q-select
                  :disable="disable" dense options-dense dark square
                  outlined v-model="info.rhesusFactor" label="Резус-фактор"
                  emit-value map-options :options="rhesusFactorList"
                />
            </div>

            <div class="col-5 col-md-4">
                <q-select
                  :disable="disable" dense options-dense dark square
                  outlined v-model="info.invalidity" label="Инвалидность"
                  emit-value map-options :options="invalidityList"
                />

            </div>

            <div class="col-7 col-md-12">
              <q-input
                :disable="disable" dense dark square outlined
                v-model="info.chronicDiseases" label="Хронические болезни"
              />
            </div>

        </div>

        <div
          class="full-width q-mt-lg row justify-center" v-if="type == 'create' || type == 'edit'"
        >
            <q-btn
              v-if="type == 'create'" color="green" outline class="shadow-2"
              @click="createCharacter" icon="fas fa-plus" label="Создать"
            />

            <div class="row q-gutter-sm justify-center" v-if="type == 'edit'">
                <q-btn
                  color="green" outline class="shadow-2"
                  @click="editCharacter" icon="fas fa-save" label="Сохранить"
                />
                <q-btn
                  color="red" outline class="shadow-2"
                  @click="deleteCharacter" icon="fas fa-trash-alt" label="Удалить персонажа"
                />

            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable eqeqeq */

import {
  sexList, raceList, eyeColorList, hairColorList, streetList,
  bloodTypeList, rhesusFactorList, invalidityList,
  toSelectArray, getRandomObjectKeyname,
} from 'src/utils.js';

export default {
  name: 'Character',

  props: {
    window: { type: Object, required: false, default: null },
    type: { type: String, required: true },
    character: { type: Object, required: false, default: null },
  },

  data() {
    return {

      info: {
        name: this.character?.name || '',
        surname: this.character?.surname || '',
        sex: this.character?.sex?.toString() || null,
        dob: this.character?.dob || '',

        placeOfWork: this.character?.placeOfWork || '',
        residenceAddress: this.character?.residenceAddress || '',
        blockNumber: this.character?.blockNumber || 0,

        height: this.character?.height || '',
        weight: this.character?.weight || '',

        race: this.character?.race?.toString() || null,

        eyeColor: this.character?.eyeColor?.toString() || null,
        hairColor: this.character?.hairColor?.toString() || null,

        description: this.character?.description || '',

        bloodType: this.character?.bloodType?.toString() || null,
        rhesusFactor: this.character?.rhesusFactor?.toString() || null,
        invalidity: this.character?.invalidity?.toString() || null,
        chronicDiseases: this.character?.chronicDiseases || '',
      },
      sexList: toSelectArray(sexList),
      raceList: toSelectArray(raceList),
      eyeColorList: toSelectArray(eyeColorList),
      hairColorList: toSelectArray(hairColorList),

      bloodTypeList: toSelectArray(bloodTypeList),
      rhesusFactorList: toSelectArray(rhesusFactorList),
      invalidityList: toSelectArray(invalidityList),

      streetList,
    };
  },

  computed: {
    disable() {
      return this.type == 'view';
    },

    age() {
      const diffTime = Date.now() - new Date(this.info.dob);
      const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
      return diffYears || 0;
    },
  },

  watch: {
    character() {
      if (this.type != 'view') return;

      Object.assign(this.$data, this.$options.data.apply(this));
    },
  },

  sockets: {
    'user/civilian/characters/createSuccess': function () {
      if (this.window == null) return;
      if (this.type != 'create') return;

      this.$q.notify({
        type: 'positive',
        message: 'Персонаж успешно создан.',
        position: 'top',
      });
      this.$store.commit('window/close', this.window.id);
    },
    'user/civilian/characters/editSuccess': function () {
      if (this.window == null) return;
      if (this.type != 'edit') return;

      this.$q.notify({
        type: 'positive',
        message: 'Персонаж успешно отредактирован.',
        position: 'top',
      });
      this.$store.commit('window/close', this.window.id);
    },
    'user/civilian/characters/deleteSuccess': function () {
      if (this.window == null) return;
      if (this.type != 'edit') return;

      this.$q.notify({
        type: 'positive',
        message: 'Персонаж успешно удалён.',
        position: 'top',
      });
      this.$store.commit('window/close', this.window.id);
    },
  },

  methods: {
    fillUnfilled() {
      if (this.type != 'create' && this.type != 'edit') return;

      if (!this.info.placeOfWork) this.info.placeOfWork = 'Безработный';
      if (!this.info.residenceAddress) this.info.residenceAddress = 'Не прописан';
      if (!this.info.bloodType) this.info.bloodType = getRandomObjectKeyname(bloodTypeList);

      if (!this.info.rhesusFactor) {
        this.info.rhesusFactor = getRandomObjectKeyname(rhesusFactorList);
      }

      if (!this.info.invalidity) this.info.invalidity = '1';
      if (!this.info.chronicDiseases) this.info.chronicDiseases = 'Отсутствуют';
    },

    createCharacter() {
      if (this.type != 'create') return;

      this.fillUnfilled();

      this.$socket.client.emit('user/civilian/characters/create', this.info);
    },

    editCharacter() {
      if (this.type != 'edit') return;

      this.fillUnfilled();

      this.$socket.client.emit('user/civilian/characters/edit', { id: this.character.id, info: this.info });
    },

    deleteCharacter() {
      if (this.type != 'edit') return;

      this.$q.dialog({
        dark: true,
        title: 'Подтверждение',
        message: 'Вы уверены, что хотите удалить персонажа?',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        this.$socket.client.emit('user/civilian/characters/delete', { id: this.character.id });
      });
    },

    streetFilterFn(val, update) {
      if (val === '') {
        update(() => {
          this.streetList = streetList;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.streetList = streetList.filter((v) => v.toLowerCase().indexOf(needle) > -1);
      });
    },
  },
};
</script>
