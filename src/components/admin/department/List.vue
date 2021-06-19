<template>
  <div>
    <q-table
      :rows="departments"
      :columns="columns"
      row-key="id"
      color="amber"
      @row-click="editDepartment"
    >
      <template v-slot:top>
        <div class="q-table__title">Департаменты</div>
        <q-space />
        <q-btn
          color='green'
          outline
          icon='fas fa-plus'
          size='sm'
          round
          @click="
            $store.commit('window/add', {
              component: 'admin/department/Template',
              params: { type: 'create', dept: val },
              title: 'Создание департамента',
              dialog: true,
              dialogMinWidth: '40vw',
            })
          "
        >
        </q-btn>
      </template>
    </q-table>
  </div>
</template>

<script>
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import $socket from 'src/boot/socketio-instance';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const departments = ref([]);

    const socketWrapper = $socket.initWrapper();

    onBeforeMount(socketWrapper.mount);
    onBeforeUnmount(socketWrapper.unmount);

    onBeforeMount(() => {
      socketWrapper.emit('admin/departments/getAll');
    });

    socketWrapper.listen('admin/departments/getAll', (val) => {
      departments.value = val;
    }, { ignoreWrapperID: true });

    const editDepartment = (evt, val) => store.commit('window/add', {
      component: 'admin/department/Template',
      params: { type: 'edit', dept: val },
      title: 'Редактирование департамента',
      dialog: true,
      dialogMinWidth: '40vw',
    });

    return {
      columns: [
        {
          name: 'id', required: true, label: 'ID', align: 'left', field: 'id', sortable: true,
        },
        {
          name: 'name', align: 'center', label: 'Название', field: 'name', sortable: true,
        },
        {
          name: 'type', label: 'Тип', field: 'type', sortable: true,
        },
      ],
      departments,
      editDepartment,
    };
  },
};
</script>
