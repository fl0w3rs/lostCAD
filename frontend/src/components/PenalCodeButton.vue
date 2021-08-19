<template>
  <q-btn
    label="Уголовный кодекс"
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
  // name: 'ComponentName'
  props: {
    admin: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();

    const onClick = () => {
      store.commit('windows/open', windowWrapper({
        component: 'PenalCode',
        type: 'dialog',
        props: {
          admin: props.admin,
        },
        title: 'Просмотр Уголовного кодекса',
        initialWidth: '70vw',
      }));
    };

    return { onClick };
  },
});
</script>
