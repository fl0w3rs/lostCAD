<template>
  <div class="error-page column items-center justify-center bg-grey-10 full-width">
    <div class="text-h3 text-orange text-bold">{{title}}</div>
    <div class="text-h5 q-mt-sm">{{message}}</div>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
  computed: {
    title() {
      return this.$store.getters['error/getTitle'];
    },
    message() {
      return this.$store.getters['error/getMessage'];
    },
  },
};
</script>
