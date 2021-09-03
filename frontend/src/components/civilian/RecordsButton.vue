<template>
  <q-btn
    color="blue"
    size="sm"
    icon="fas fa-list"
    outline
    label="Записи"
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
        title: 'Записи',
        type: 'dialog',
        component: 'civilian/Records',
        initialWidth: '800px',
        initialHeight: '500px',
      }));
    };

    return { onClick };
  },
});
</script>
