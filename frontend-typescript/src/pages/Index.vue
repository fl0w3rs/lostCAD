<template>
  <div class="row items-center justify-center" style="min-height: inherit;">
    test
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'src/store';
import { windowWrapper } from 'src/store/windows/types';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const store = useStore();

    store.commit('windows/open', windowWrapper({
      title: '', type: 'draggable', initialWidth: '50vw', component: 'Test',
    }));
    return {};
  },
});
</script>
