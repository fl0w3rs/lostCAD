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
import { defineComponent, PropType } from 'vue';
import { useStore } from 'vuex';

interface Tabs {
  ncic?: boolean;
  dmv?: boolean;
  fld?: boolean;
}

export default defineComponent({
  // name: 'ComponentName'
  props: {
    tabs: {
      type: Object as PropType<Tabs>,
      required: false,
    },
  },
  setup(props) {
    const store = useStore();

    const onClick = () => {
      store.commit('windows/open', windowWrapper({
        component: 'Lookup',
        type: 'draggable',
        title: 'База данных',
        initialWidth: '800px',
        initialHeight: '400px',
        props: { types: props.tabs },
      }));
    };

    return { onClick };
  },
});
</script>
