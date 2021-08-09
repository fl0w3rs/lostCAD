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
          @click="openCreateDepartmentWindow"
        >
        </q-btn>
      </template>
    </q-table>
  </div>
</template>

<script>
import { onBeforeMount, ref } from 'vue';
import { SocketWrapper } from 'src/boot/socketio-instance';
import { useStore } from 'vuex';
import { windowWrapper } from 'src/store/windows/types';

export default {
  setup() {
    const store = useStore();

    const departments = ref([]);

    const socketWrapper = new SocketWrapper();

    onBeforeMount(() => {
      socketWrapper.emit('admin/departments/getAll');
    });

    socketWrapper.listen('admin/departments/getAll', (val) => {
      departments.value = val;
    }, { ignoreWrapperID: true });

    const editDepartment = (evt, val) => store.commit('windows/open', windowWrapper({
      component: 'admin/department/Template',
      props: { type: 'edit', dept: val },
      title: 'Редактирование департамента',
      type: 'dialog',
      initialWidth: '40vw',
    }));

    const openCreateDepartmentWindow = () => {
      store.commit('windows/open', windowWrapper({
        component: 'admin/department/Template',
        props: { type: 'create' },
        title: 'Создание департамента',
        type: 'dialog',
        initialWidth: '40vw',
      }));
    };

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

      openCreateDepartmentWindow,
    };
  },
};
</script>
