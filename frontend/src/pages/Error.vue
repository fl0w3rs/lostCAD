<template>
  <div class="error-page column items-center justify-center bg-grey-10 full-width">
    <div class="text-h3 text-orange text-bold">{{title}}</div>
    <div class="text-h5 q-mt-sm">{{message}}</div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ErrorPage',
  setup() {
    const store = useStore();

    const title = computed(() => store.getters['error/getTitle']);
    const message = computed(() => store.getters['error/getMessage']);

    return {
      title,
      message,
    };
  },
};
</script>
