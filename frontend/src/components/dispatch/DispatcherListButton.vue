<template>
  <q-btn
    label="СПИСОК ДИСПЕТЧЕРОВ"
    outline
    size="sm"
    @click="onClick"
  />
</template>

<script lang="ts">
import { windowWrapper } from 'src/store/windows/types';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();

    const onClick = () => {
      store.commit('windows/open', windowWrapper({
        component: 'dispatch/DispatcherList',
        type: 'dialog',
        title: 'Список диспетчеров',
        initialWidth: '25vw',
      }));
    };

    return { onClick };
  },
});
</script>
