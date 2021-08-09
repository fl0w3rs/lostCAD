<template>
  <q-btn
    label="Уголовный кодекс"
    outline
    color="gray"
    size="sm"
    @click="onClick"
  />
</template>

<script lang="ts">
import { windowWrapper } from 'src/store/windows/types';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  // name: 'ComponentName'
  setup() {
    const store = useStore();

    const onClick = () => {
      store.commit('windows/open', windowWrapper({
        component: 'PenalCode',
        type: 'dialog',
        title: 'Просмотр Уголовного кодекса',
        initialWidth: '70vw',
      }));
    };

    return { onClick };
  },
});
</script>
