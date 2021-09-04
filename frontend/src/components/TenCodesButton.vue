<template>
  <q-btn
    label="10-КОДЫ"
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
        component: 'TenCodes',
        title: 'Просмотр 10-кодов',
        initialWidth: '35vw',
        type: 'dialog',
        props: {
          admin: props.admin,
        },
      }));
    };

    return { onClick };
  },
});
</script>
