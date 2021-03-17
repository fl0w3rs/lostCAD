<template>
  <div class="error-page column items-center justify-center bg-grey-10 full-width">
    <div class="text-h3 text-orange text-bold">{{$store.getters['error/getTitle']}}</div>
    <div class="text-h5 q-mt-sm">{{$store.getters['error/getMessage']}}</div>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
};
</script>
