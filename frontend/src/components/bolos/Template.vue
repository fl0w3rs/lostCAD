<template>
  <div class="row text-uppercase">
    <div
      class="q-mb-md col-12 text-right"
      v-if="currentDepartment === 'dispatch' && type === 'view'"
    >
      <q-btn
        v-if="editMode"
        label="Сохранить"
        icon="save"
        color="green"
        class="q-mr-sm"
        outline size="sm"
        @click="save"
      />
      <q-btn
        :label="editMode ? 'Режим просмотра' : 'Режим редактирования'"
        :icon="editMode ? 'visibility' : 'edit'"
        :color="editMode ? 'grey' : 'orange'"
        outline size="sm"
        @click="editMode = !editMode"
      />
    </div>
    <div class="col-12">
      <q-select
        dense options-dense outlined label="Тип"
        emit-value map-options :readonly="!canEdit"
        :options="boloTypeList" v-model="data.type"
      ></q-select>
    </div>
    <div class="q-mt-sm col-12">
      <div class="q-pa-md bg-grey-10 rounded-borders relative-position accent">
        <div class="absolute-right q-pa-sm" v-if="canEdit">
          <q-btn
            label="Добавить" color="green" outline
            @click="addReason" size="sm" icon="fas fa-plus"
          />
        </div>
        <p class="text-bold text-grey">Причины розыска</p>

        <div class="q-mt-xs q-pa-xs bg-dark" v-for="(article, key) in data.reasons" :key="key">
          <div class="text-bold relative-position" style="font-size: 18px;">
            <div class="absolute-right" v-if="canEdit">
              <q-icon
                name="close" class="cursor-pointer"
                @click="removeReason(key)" color="red" />
            </div>
            {{article.article}}. {{article.title}}
          </div>
        </div>
      </div>
    </div>

    <div class="q-mt-sm col-12">
      <div v-if="data?.type === 'custom'">
        <q-input
          :readonly="!canEdit"
          dense outlined v-model="data.data.shortDescription"
          label="Краткое описание объекта розыска (отображается в таблице)"
        ></q-input>

        <q-input
          class="q-mt-xs"
          :readonly="!canEdit"
          dense outlined v-model="data.data.description"
          label="Подробное описание объекта розыска"
          type="textarea"
        ></q-input>
      </div>

      <div v-if="canEdit && data?.type === 'character'">
        <div v-if="data?.data?.characterId && data?.characterData" class="relative-position">
          <p class="text-h6 text-bold">
            Выбранный человек
            <q-btn
              size="sm" outline label="Выбрать другого"
              @click="data.data.characterId = null;">
            </q-btn>
          </p>

          <character
            :hideMed="true" v-if="data.type === 'character'"
            type="ncic" :character="data.characterData"
          />

        </div>

        <div v-else>
          <p class="text-h6 text-bold">
            Объект поиска не выбран <q-btn
              size="sm" outline label="Выбрать человека"
              @click="selectCharacter">
            </q-btn>
          </p>
        </div>
      </div>

      <q-expansion-item
        dense
        dense-toggle
        expand-separator
        label="Подробная информация"
        header-class="q-mt-sm bg-grey-10 text-light rounded-borders accent"
        v-if="
          (type === 'view' && !editMode)
          && (
            (data.type === 'character' && data.characterData)
            || (data.type === 'vehicle' && data.vehicleData)
          )
        "
      >
        <div
          class="q-pa-md bg-grey-10 rounded-borders"
        >
          <character
            :hideMed="true" v-if="data.type === 'character'"
            type="ncic" :character="data.characterData" />
          <vehicle v-if="data.type === 'vehicle'" type="dmv" :vehicle="data.vehicleData" />
        </div>
      </q-expansion-item>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, watch,
} from 'vue';
import Character from 'src/components/civilian/Character.vue';
import Vehicle from 'src/components/vehicle/Template.vue';
import { useStore } from 'vuex';
import { windowWrapper } from 'src/store/windows/types';
import { SocketWrapper } from 'src/boot/socketio-instance';
import { useQuasar } from 'quasar';

import _ from 'lodash';

const boloTypeList = {
  character: 'Человек',
  vehicle: 'Транспортное средство',
  custom: 'Другое',
};

const boloTypeListMapped = Object.entries(boloTypeList).map(
  (val) => ({ value: val[0], label: val[1] }),
);

export default defineComponent({
  props: ['boloData', 'type', 'window'],
  components: { Character, Vehicle },
  setup(props: any) {
    const data = reactive(_.cloneDeep(props.boloData) || {});

    const socketWrapper = new SocketWrapper();
    const $q = useQuasar();
    const store = useStore();

    let oldData = {};
    let wasSaved = false;

    const editMode = ref(false);
    watch(editMode, (val) => {
      if (val) {
        oldData = { ...data };
      }

      if (!val) {
        if (!wasSaved) Object.assign(data, oldData);
        wasSaved = false;
      }
    });

    const canEdit = computed(() => editMode.value || props.type === 'create');

    const addReason = () => {
      store.commit('windows/open', windowWrapper({
        type: 'dialog',
        component: 'PenalCode',
        initialWidth: '70vw',
        props: {
          mode: 'select',
          onClick: (row) => {
            if (typeof data.reasons === 'object') data.reasons = Object.values(data.reasons);
            data.reasons.push(row);
          },
        },
      }));
    };

    const removeReason = (key) => {
      if (typeof data.reasons === 'object') data.reasons = Object.values(data.reasons);
      data.reasons.splice(key, 1);
    };

    const save = () => {
      if (!editMode.value) return;

      socketWrapper.emit('bolos:save', data).onReturn((resp) => {
        if (!resp) return;
        editMode.value = false;
        $q.notify({
          type: 'positive',
          message: 'Успешно сохранено.',
        });
      });

      wasSaved = true;
    };

    const selectCharacter = () => {
      store.commit('windows/open', windowWrapper({
        component: 'Lookup',
        type: 'dialog',
        initialWidth: '50vw',
        props: {
          searchMode: true,
          defaultTab: 'ncic',
          onNcicRowClickOverwrite: (evt, row) => {
            data.characterData = row;
            data.data.characterId = row.id;
          },
        },
      }));
    };

    return {
      data,

      addReason,
      removeReason,
      save,
      selectCharacter,

      currentDepartment: computed(() => store.getters['user/getCurrentDepartment']),
      editMode,

      canEdit,
      boloTypeList: boloTypeListMapped,
    };
  },
});
</script>
