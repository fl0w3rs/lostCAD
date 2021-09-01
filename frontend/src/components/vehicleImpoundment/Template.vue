<template>
  <div class="row text-uppercase">
    <div class="col-12">
      <div class="text-left text-bold sectionTitle">
        ИНФОРМАЦИЯ ОБ ТРАНСПОРТНОМ СРЕДСТВЕ
        <q-btn
          label="Поиск" outline size="sm"
          icon="search" color="teal" @click="openSelectVehicle"
          v-if="canEdit && !data.vehicleId"
        />
      </div>
      <div class="section q-mt-xs q-pa-xs q-gutter-xs">
        <vehicle
          type="dmv" :vehicle="vehicleData" v-if="vehicleData !== null"
        />
        <span class="text-grey" v-else>ТРАНСПОРТНОЕ СРЕДСТВО НЕ УКАЗАНО</span>
      </div>
    </div>

    <div class="col-12 q-mt-sm">
      <div class="text-left text-bold sectionTitle">
        ЗАМЕТКИ
      </div>
      <div class="q-mt-xs accent">
        <q-input dense outlined square type="textarea" v-model="data.data.notes"
                :readonly="!canEdit">

        </q-input>
      </div>
    </div>
    <div class="col-12 q-mt-sm">
      <div class="text-left text-bold sectionTitle">
        ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ
      </div>
      <div class="section q-mt-xs row">
        <div class="col-12">
          <q-input
            dense outlined square v-model="data.data.additionalInfo.officers"
            label="Участвовавшие офицеры" autogrow
                :readonly="!canEdit" />
        </div>
        <div class="col-12 col-md-6">
          <q-input dense outlined square v-model="data.data.additionalInfo.date" label="Дата"
                :readonly="!canEdit" type="date" stack-label />
        </div>
        <div class="col-12 col-md-6">
          <q-input dense outlined square v-model="data.data.additionalInfo.time" label="Время"
                :readonly="!canEdit" type="time" stack-label />
        </div>
      </div>
    </div>
    <div class="col-12 q-mt-md text-center q-gutter-xs" v-if="type === 'create'">
      <q-btn label="Выписать" color="orange" outline icon="garage"
        @click="create"></q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import {
  defineComponent, reactive, ref, watch, onBeforeMount, computed,
} from 'vue';
import Vehicle from 'src/components/vehicle/Template.vue';
import { SocketWrapper } from 'src/boot/socketio-instance';
import { useStore } from 'vuex';
import { windowWrapper } from 'src/store/windows/types';
import { useQuasar } from 'quasar';

export default defineComponent({
  props: [
    'impoundmentData',
    'type',
    'vehicleId',
    'window',
  ],
  components: { Vehicle },
  setup(props: any) {
    const socketWrapper = new SocketWrapper();
    const store = useStore();
    const $q = useQuasar();

    const canEdit = computed(() => props.type === 'create');

    const data = reactive(_.cloneDeep(props.impoundmentData) || {});
    if (!data?.data) data.data = {};

    data.vehicleId = props?.vehicleId || data?.vehicleId || null;

    if (!data?.data?.additionalInfo) data.data.additionalInfo = {};

    if (!data?.reasons) data.reasons = [];

    const vehicleData = ref < null | Record<string, unknown> >(null);

    const fetchVehicle = (id) => {
      if (!id) return;

      vehicleData.value = null;

      socketWrapper.emit('lookup/requestVehicle', { id }).onReturn(
        (payload: any) => {
          vehicleData.value = payload.data;
        },
      );
    };

    const openSelectVehicle = () => {
      store.commit('windows/open', windowWrapper({
        component: 'Lookup',
        type: 'dialog',
        initialWidth: '50vw',
        props: {
          searchMode: true,
          defaultTab: 'dmv',
          closeOnOverwriteCall: true,
          onDmvRowClickOverwrite: (evt, row) => {
            data.vehicleId = row.id;
          },
        },
      }));
    };

    const addReason = () => {
      store.commit('windows/open', windowWrapper({
        type: 'dialog',
        component: 'PenalCode',
        initialWidth: '70vw',
        props: {
          onlyArrests: true,
          mode: 'select',
          onClick: (row) => {
            data.reasons.push(row);
          },
        },
      }));
    };

    const deleteReason = (key) => {
      data.reasons.splice(key, 1);
    };

    const addOwnReason = () => {
      data.reasons.push({
      });
    };

    watch(() => data.vehicleId, fetchVehicle);

    onBeforeMount(() => {
      fetchVehicle(data?.vehicleId || null);
    });

    const create = () => {
      socketWrapper.emit('vehicleImpoundments:create', data).onReturn((val) => {
        if (!val) return;
        props.window.doClose();
        $q.notify({
          type: 'positive',
          message: 'Изъятие успешно создано.',
        });
      });
    };

    return {
      data,
      vehicleData,

      openSelectVehicle,

      canEdit,

      addReason,
      addOwnReason,
      deleteReason,

      create,
    };
  },
});
</script>
