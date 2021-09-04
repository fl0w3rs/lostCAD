<template>
  <q-table dense :pagination="{
    rowsPerPage: 10,
    sortBy: 'fid'
  }" :columns="columns" :rows="users">
    <template v-slot:body-cell="props">
      <q-td :props="props">
        {{props.value}}
        <q-menu touch-position>
          <q-list dense style="min-width: 100px">
            <q-item @click="openLogWindow(props.row)" clickable v-close-popup>
              <q-item-section avatar>
                <q-icon
                  name="fa fa-history" color="grey"
                />
              </q-item-section>
              <q-item-section>Посмотреть логи</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
import { SocketWrapper } from 'src/boot/socketio-instance';
import { windowWrapper } from 'src/store/windows/types';
import { defineComponent, ref, onBeforeMount } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const socketWrapper = new SocketWrapper();
    const users = ref([]);
    const store = useStore();

    onBeforeMount(() => {
      socketWrapper.emit('admin:users:getAll').onReturn((payload: any) => {
        users.value = payload;
      });
    });

    const openLogWindow = (row) => {
      store.commit('windows/open', windowWrapper({
        type: 'dialog',
        component: 'admin/logS/View',
        title: 'Просмотр логов',
        initialWidth: '40vw',
        props: {
          type: 'user',
          userId: row.id,
        },
      }));
    };

    return {
      users,
      openLogWindow,
      columns: [
        {
          name: 'id',
          field: 'id',
          label: 'ID в системе',
          align: 'left',
        },
        {
          name: 'fid',
          field: 'fid',
          label: 'Форумный ID',
          align: 'center',
        },
        {
          name: 'lastLogin',
          field: 'lastLogin',
          label: 'Последний вход',
          align: 'center',
          format: (val) => {
            const date = new Date((val || 0) * 1000);
            return `${date.toLocaleTimeString()}, ${date.toLocaleDateString()}`;
          },
        },
        {
          name: 'name',
          field: 'name',
          label: 'Форумное имя',
          align: 'right',
        },
      ],
    };
  },
});
</script>
