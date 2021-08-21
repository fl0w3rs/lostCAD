<template>
  <div class="row q-col-gutter-xs">
    <div class="col-6 col-md-4">
      <q-input label="Заявитель" outlined dense readonly v-model="data.caller"></q-input>
    </div>
    <div class="col-6 col-md-4">
      <q-select
        label="Статус" outlined dense
        v-model="data.status" :options="statusListComputed"
        map-options emit-value
        option-label="text"
        option-value="value"
        :readonly="!isDispatcher"
        options-dense
      ></q-select>
    </div>
    <div class="col-6 col-md-4">
      <q-select
        label="Приоритет" outlined dense
        v-model="data.priority" :options="['Низкий', 'Средний', 'Высокий']"
        :readonly="!isDispatcher"
        options-dense
      ></q-select>
    </div>
    <div class="col-6 col-md-5">
      <q-input
        label="Местоположение" outlined dense v-model="data.location"
        :readonly="!isDispatcher"></q-input>
    </div>
    <div class="col-6 col-md-2">
      <q-input
        label="Блок" outlined dense v-model="data.blockNumber"
        :readonly="!isDispatcher"></q-input>
    </div>
    <div class="col-6 col-md-5">
      <q-select
        label="Тип вызова" outlined dense
        v-model="data.type" :options="callTypeList"
        :readonly="!isDispatcher"
        options-dense
      >
        <template v-slot:selected-item="scope">
          <div class="ellipsis">{{scope.opt}}</div>
        </template>
      </q-select>
    </div>
    <div class="col-12">
      <q-input
        label="Описание" readonly outlined dense
        v-model="data.description" type="textarea"></q-input>
    </div>
    <template v-if="true">
      <div class="col-12">
        <q-field outlined readonly dense label="Примечания к вызову" stack-label>
          <template v-slot:control>
            <q-scroll-area class="full-width q-py-xs" style="height: 130px;">
              <div style="height: inherit;" v-html="notesComputed"></div>
            </q-scroll-area>
          </template>
        </q-field>
      </div>
      <div class="col-12">
        <q-input outlined dense @keyup.enter="addNote" label="Новое примечание" v-model="newNote">
          <template v-slot:append>
            <q-btn
              outline label="Добавить" color="green"
              @click="addNote" size="sm"
            />
          </template>
        </q-input>
      </div>

      <div class="col-12" v-if="isDispatcher">
        <q-field outlined readonly dense label="Прикреплённые юниты" stack-label>
          <template v-slot:control>
            <div class="q-gutter-xs q-my-sm">

              <q-badge
                v-for="(unit, key) in data.units" v-bind:key="unit.id"
                class="text-white text-uppercase q-mt-xs"
                :color="['blue-grey-6', 'blue-grey-7'][(key + 1) % 2]"
              >
                {{unit.callsign}}, {{unitStatusList[unit.status].text}}
                <q-icon
                  @click="dispatchDetachUnit(unit)"
                  name="fa fa-times" class="cursor-pointer text-deep-orange-10 q-ml-xs"
                />
              </q-badge>
              <q-badge
                class="q-mt-xs cursor-pointer" @click="dispatchAttachUnit"
                outline color="secondary" label="Прикрепить"
              />
            </div>
          </template>
        </q-field>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, watch,
} from 'vue';
import { callStatusList, callTypeList, unitStatusList } from 'src/utils/constants';
import bbCodeParser from 'js-bbcode-parser';
import { SocketWrapper } from 'src/boot/socketio-instance';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import { windowWrapper } from 'src/store/windows/types';

const newCallNoteAudio = new Audio(require('src/assets/sounds/newCallNote.mp3'));

export default defineComponent({
  props: {
    callData: {
      type: Object,
      required: true,
    },
    isDispatcher: {
      type: Boolean,
    },
  },
  setup(props) {
    const socketWrapper = new SocketWrapper();
    const $q = useQuasar();
    const store = useStore();

    const data = ref({ ...props.callData });
    watch(() => props.callData, (val) => { data.value = { ...val }; });

    socketWrapper.listen('updateActiveCalls', (payload: any) => {
      for (let i = 0; i < payload.length; i += 1) {
        if (payload[i].id === data.value.id) data.value = payload[i];
      }
    }, { ignoreWrapperID: true });

    socketWrapper.listen('calls:sound:notify', (payload:any) => {
      if (data.value.id === payload) newCallNoteAudio.play();
    }, { ignoreWrapperID: true });

    const newNote = ref('');
    const addNote = () => {
      socketWrapper.emit('calls:addNote', { callId: data.value.id, text: newNote.value, dispatcher: props.isDispatcher });
      newNote.value = '';
    };

    const dispatchDetachUnit = (unit) => {
      $q.dialog({
        title: 'Открепление юнита',
        message: `Вы уверены, что хотите открепить юнит ${unit.callsign}?`,
        cancel: true,
        persistent: true,
        ok: {
          label: 'Да',
          flat: true,
        },
      }).onOk(() => {
        socketWrapper.emit('calls:detachUnit', { unitId: unit.id });
      });
    };

    const dispatchAttachUnit = () => {
      store.commit('windows/open', windowWrapper({
        type: 'dialog',
        component: 'calls/AttachUnit',
        initialWidth: '20vw',
        props: {
          callId: data.value.id,
        },
      }));
    };

    return {
      data,

      addNote,
      newNote,
      notesComputed: computed(() => bbCodeParser.parse(data?.value?.notes || 'Тут пока пусто.')),

      dispatchAttachUnit,
      dispatchDetachUnit,

      callTypeList,
      unitStatusList,
      statusListComputed: computed(() => Object.entries(callStatusList).map((val) => ({
        value: val[0], text: val[1].text,
      }))),
    };
  },
});
</script>
