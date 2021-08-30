<template>
  <div class="row">
    <div class="col-12">
      <q-select
        dense options-dense outlined label="Тип"
        emit-value map-options :readonly="!canEdit"
        :options="boloTypeList" v-model="data.type"
      ></q-select>
    </div>
    <div class="col-12">
      <div class="q-mt-sm q-pa-md bg-grey-10 rounded-borders relative-position">
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

    <div class="col-12">
      <div class="q-mt-sm" v-if="data?.type === 'custom'">
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

      <q-expansion-item
        dense
        dense-toggle
        expand-separator
        label="Подробная информация"
        header-class="q-mt-sm bg-grey-10 text-light rounded-borders"
        v-if="type === 'view' && (data.type === 'character' || data.type === 'vehicle')"
      >
        <div
          class="q-pa-md bg-grey-10 rounded-borders"
        >
          <character v-if="data.type === 'character'" type="ncic" :character="data.characterData" />
          <vehicle v-if="data.type === 'vehicle'" type="dmv" :vehicle="data.vehicleData" />
        </div>
      </q-expansion-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import Character from 'src/components/civilian/Character.vue';
import Vehicle from 'src/components/vehicle/Template.vue';
import { useStore } from 'vuex';
import { windowWrapper } from 'src/store/windows/types';

const boloTypeList = {
  character: 'Человек',
  vehicle: 'Транспортное средство',
  custom: 'Другое',
};

const boloTypeListMapped = Object.entries(boloTypeList).map(
  (val) => ({ value: val[0], label: val[1] }),
);

export default defineComponent({
  props: ['boloData', 'type'],
  components: { Character, Vehicle },
  setup(props) {
    const data = reactive({ ...props?.boloData } || {});
    const canEdit = props.type === 'create' || props.type === 'edit';
    const store = useStore();

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
      data.reasons.splice(key);
    };

    return {
      data,

      addReason,
      removeReason,

      canEdit,
      boloTypeList: boloTypeListMapped,
    };
  },
});
</script>
