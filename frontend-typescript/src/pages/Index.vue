<template>
  <q-page class="row items-center justify-center">
    test
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'src/store';
import { windowWrapper } from 'src/store/windows/types';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const store = useStore();
    console.log(store);
    store.commit('windows/open', windowWrapper({ title: '', type: 'draggable' }));
    return {};
  },
});
</script>
