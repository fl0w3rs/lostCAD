<template>
  <div class="text-uppercase relative-position">
    <div class="absolute-right q-ma-sm" v-if="isDispatch && !isArchive">
      <q-btn
        size="sm" outline color="orange" class="q-mr-xs" label="Архив" icon="archive"
        @click="openArchiveWindow"
      />
      <q-btn
        size="sm" outline color="green" label="Создать" icon="fas fa-plus"
        @click="openCreateCallWindow"
      />
    </div>
    <p class="text-h6 q-mb-sm" style="text-transform: none;">
      {{isArchive ? 'Архив' : 'Список'}} звонков
    </p>
    <q-table
      dense
      :rows="list" :columns="columns"
      @row-click="onClick"
      flat
      class="bg-transparent"
      :pagination="{
        rowsPerPage: isArchive ? 15 : 0,
        sortBy: 'id',
        descending: true
      }"
    >

    </q-table>
  </div>
</template>

<script lang="ts">
import { socketInstance, SocketWrapper } from 'src/boot/socketio-instance';
import { windowWrapper } from 'src/store/windows/types';
import { callStatusList } from 'src/utils/constants';
import {
  defineComponent, onBeforeMount, computed, ref,
} from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  props: {
    isDispatch: {
      type: Boolean,
      default: false,
    },
    isArchive: {
      type: Boolean,
      default: false,
    },
    window: Object,
  },
  setup(props: any) {
    const store = useStore();
    const archivedCalls = ref([]);
    const socketWrapper = new SocketWrapper();

    onBeforeMount(() => {
      if (props.isArchive) {
        socketWrapper.emit('calls:getArchived').onReturn((payload: any) => {
          archivedCalls.value = payload;
        });
      } else {
        socketInstance.emit('calls:getActive');
      }
    });

    const onClick = (evt, row) => {
      if (props.isArchive) props.window.doClose();
      store.commit('windows/open', windowWrapper({
        component: 'calls/View',
        type: 'draggable',
        title: 'Просмотр вызова',
        initialWidth: '50vw',
        // eslint-disable-next-line no-nested-ternary
        initialHeight: props.isArchive ? '420px' : props.isDispatch ? '570px' : '465px',
        props: {
          callData: row,
          type: props.isDispatch ? 'dispatch' : 'view',
        },
      }));
    };

    const openCreateCallWindow = () => {
      store.commit('windows/open', windowWrapper({
        component: 'calls/View',
        title: 'Создание звонка',
        type: 'dialog',
        initialWidth: '50vw',
        props: { type: 'create' },
      }));
    };

    const openArchiveWindow = () => {
      store.commit('windows/open', windowWrapper({
        component: 'calls/List',
        type: 'dialog',
        title: 'Архив вызовов',
        initialWidth: '50vw',
        props: {
          isArchive: true,
          type: 'dispatch',
        },
      }));
    };

    return {
      list: props.isArchive ? archivedCalls : computed(() => store.getters['calls/getActive']),
      onClick,
      openCreateCallWindow,
      openArchiveWindow,
      columns: [
        {
          name: 'id',
          label: 'Номер',
          field: 'id',
          sortable: true,
          align: 'left',
        },
        {
          name: 'type', label: 'Тип', field: 'type', sortable: true, align: 'center',
        },
        {
          name: 'units',
          label: 'Прикреплённые юниты',
          field: 'units',
          sortable: true,
          align: 'center',
          format: (val, row) => (row.units.map((cv) => cv.callsign)).join(', ') || '-',
        },
        {
          name: 'status',
          label: 'Статус',
          field: 'status',
          sortable: true,
          align: 'right',
          format: (val) => callStatusList[val]?.text || 'Ошибка',
          classes: (row) => callStatusList[row.status]?.classes || '',
        },
      ],
    };
  },
});
</script>
