<template>
  <div>
    <q-table
      title="Департаменты"
      :rows="departments"
      :columns="columns"
      row-key="id"
      dark
      color="amber"
    />
  </div>
</template>

<script>
export default {
  name: 'AdminDepartmentList',
  data() {
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
      departments: [],
    };
  },

  sockets: {
    'admin/departments/getAll': function (val) {
      // console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
      this.departments = val;
    },
  },

  mounted() {
    this.$socket.client.emit('admin/departments/getAll');
  },
};
</script>
