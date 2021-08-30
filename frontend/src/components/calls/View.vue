<template>
  <div class="row q-col-gutter-xs text-uppercase">
    <div class="col-12 q-mb-xs q-gutter-xs text-center" v-if="canEdit">
      <q-btn size="sm"
        @click="dispatchArchiveCall" label="Архивировать" icon="archive" color="grey" outline />
    </div>
    <div class="col-6 col-md-4">
      <q-input
        label="Заявитель" :readonly="!canCreate"
        outlined dense v-model="data.caller"
      ></q-input>
    </div>
    <div class="col-6 col-md-4">
      <q-select
        label="Статус" outlined dense
        v-model="data.status" :options="statusListComputed"
        map-options emit-value
        option-label="text"
        option-value="value"
        @update:model-value="updateCall"
        :readonly="!canEdit && !canCreate"
        options-dense
      ></q-select>
    </div>
    <div class="col-6 col-md-4">
      <q-select
        label="Приоритет" outlined dense
        @update:model-value="updateCall"
        v-model="data.priority" :options="['Низкий', 'Средний', 'Высокий']"
        :readonly="!canEdit && !canCreate"
        options-dense
      ></q-select>
    </div>
    <div class="col-6 col-md-5">
      <q-input
        @update:model-value="updateCall"
        label="Местоположение" debounce="1000" outlined dense v-model="data.location"
        :readonly="!canEdit && !canCreate"></q-input>
    </div>
    <div class="col-6 col-md-2">
      <q-input
        @update:model-value="updateCall"
        label="Блок" debounce="1000" outlined dense v-model="data.blockNumber"
        :readonly="!canEdit && !canCreate"></q-input>
    </div>
    <div class="col-6 col-md-5">
      <q-select
        @update:model-value="updateCall"
        label="Тип вызова" outlined dense
        v-model="data.type" :options="callTypeList"
        :readonly="!canEdit && !canCreate"
        options-dense
      >
        <template v-slot:selected-item="scope">
          <div class="ellipsis">{{scope.opt}}</div>
        </template>
      </q-select>
    </div>
    <div class="col-12">
      <q-input
        label="Описание" :readonly="!canCreate" outlined dense
        v-model="data.description" type="textarea"></q-input>
    </div>
    <template v-if="!canCreate">
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

      <div class="col-12" v-if="canEdit">
        <q-field outlined readonly dense label="Прикреплённые юниты" stack-label>
          <template v-slot:control>
            <div class="q-gutter-xs q-my-sm">

              <q-chip
                class="text-uppercase"
                v-for="unit in data.units" v-bind:key="unit.id"
                removable @remove="dispatchDetachUnit(unit)" color="blue-grey-6"
                text-color="white"
              >
                {{unit.callsign}}, {{unitStatusList[unit.status].text}}
              </q-chip>
              <q-chip
                class="text-uppercase" outline clickable
                @click="dispatchAttachUnit" color="green"
                text-color="white" icon="fas fa-plus"
              >
                Прикрепить
              </q-chip>
            </div>
          </template>
        </q-field>
      </div>
    </template>

    <div class="col-12 text-center q-gutter-sm q-mt-xs" v-if="canCreate">
      <q-btn color="green" label="Создать" @click="createCall" icon="fas fa-plus" outline />
    </div>
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
import { Howl } from 'howler';

const newCallNoteAudio = new Howl({
  src: [require('src/assets/sounds/newCallNote.mp3')],
});

export default defineComponent({
  props: {
    callData: {
      type: Object,
      required: true,
    },
    type: {
      type: Boolean,
    },
    window: {
      type: Object,
    },
  },
  setup(props: any) {
    const socketWrapper = new SocketWrapper();
    const $q = useQuasar();
    const store = useStore();

    const data = ref({ ...props.callData });
    watch(() => props.callData, (val) => { data.value = { ...val }; });

    // shared (w/o create)

    const updateCall = () => {
      if (props.type !== 'dispatch') return;
      setTimeout(() => socketWrapper.emit('calls:update', data.value), 100);
    };

    if (props.type !== 'create') {
      socketWrapper.listen('updateActiveCalls', (payload: any) => {
        for (let i = 0; i < payload.length; i += 1) {
          if (payload[i].id === data.value.id) {
            data.value = payload[i];
            return;
          }
        }

        props.window.doClose();
      }, { ignoreWrapperID: true });

      socketWrapper.listen('calls:sound:notify', (payload:any) => {
        if (data.value.id === payload) newCallNoteAudio.play();
      }, { ignoreWrapperID: true });
    }

    // shared

    const newNote = ref('');
    const addNote = () => {
      socketWrapper.emit('calls:addNote', { callId: data.value.id, text: newNote.value, dispatcher: props.type === 'dispatch' });
      newNote.value = '';
    };

    // dispatch

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

    const dispatchArchiveCall = () => {
      $q.dialog({
        title: 'Открепление юнита',
        message: 'Вы уверены, что хотите архивировать вызов?',
        cancel: true,
        persistent: true,
        ok: {
          label: 'Да',
          flat: true,
        },
      }).onOk(() => {
        socketWrapper.emit('calls:archive', { callId: data.value.id });
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

    // create

    const createCall = () => {
      socketWrapper.emit('calls:create', { dispatcher: true, callData: data.value }).onReturn((resp) => {
        if (resp === 'error') return;

        props.window.doClose();
      });
    };

    // ==

    return {
      data,

      // create
      createCall,

      // dispatch
      updateCall,
      dispatchArchiveCall,

      // shared (w/o create)
      addNote,
      newNote,
      notesComputed: computed(() => bbCodeParser.parse(data?.value?.notes || 'Тут пока пусто.')),

      dispatchAttachUnit,
      dispatchDetachUnit,

      // shared for all
      callTypeList,
      unitStatusList,
      statusListComputed: computed(() => Object.entries(callStatusList).map((val) => ({
        value: val[0], text: val[1].text,
      }))),

      canEdit: props.type === 'dispatch',
      canCreate: props.type === 'create',
    };
  },
});
</script>
