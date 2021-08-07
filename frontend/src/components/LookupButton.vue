<template>
  <q-btn
    label="БАЗА ДАННЫХ"
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
        component: 'Lookup',
        type: 'draggable',
        title: 'База данных',
        initialWidth: '800px',
        initialHeight: '400px',
      }));
    };

    return { onClick };
  },
});
</script>
