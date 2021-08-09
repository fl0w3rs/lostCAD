<template>
  <q-btn
    label="10-КОДЫ"
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
        component: 'TenCodes',
        title: 'Просмотр 10-кодов',
        initialWidth: '30vw',
        type: 'dialog',
      }));
    };

    return { onClick };
  },
});
</script>
