<template>
  <div class="text-uppercase">
    <q-table
      :rows="list" :columns="columns"
    >

    </q-table>
  </div>
</template>

<script lang="ts">
import { socketInstance } from 'src/boot/socketio-instance';
import { defineComponent, onBeforeMount, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();

    onBeforeMount(() => {
      socketInstance.emit('calls:getActive');
    });

    return {
      list: computed(() => store.getters['calls/getActive']),
      columns: [
        {
          name: 'id', label: 'Номер', field: 'id', sortable: true, align: 'left',
        },
        {
          name: 'type', label: 'Тип', field: 'type', sortable: true, align: 'center',
        },
        {
          name: 'status', label: 'Статус', field: 'status', sortable: true, align: 'right',
        },
      ],
    };
  },
});
</script>
