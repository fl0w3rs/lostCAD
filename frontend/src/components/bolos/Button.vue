<template>
  <q-btn
    label="РОЗЫСК"
    outline
    @click="onClick"
    size="sm"
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
        type: 'draggable',
        component: 'bolos/List',
        initialWidth: '50vw',
        initialHeight: '500px',
        title: 'Розыск',
      }));
    };

    return { onClick };
  },
});
</script>
