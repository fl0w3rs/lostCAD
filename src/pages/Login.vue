<template>
  <div class="login-page column items-center justify-center full-width">
    <q-img
      :src="require('../assets/logo.png')"
      style="max-height: 200px; max-width: 500px;"
      class="blink"
    />
    <!-- <div class="row flex-center q-mt-sm full-width">
      <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-8">
        <q-btn class="full-width" color="green" icon="login" label="ВОЙТИ" v-on:click="doLogin" />
      </div>
    </div> -->
  </div>
</template>

<style scoped>
.blink {
  animation: blink 2s linear infinite;
}

@keyframes blink {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0.7;
  }
}
</style>

<script>
/* eslint-disable eqeqeq */
export default {
  name: 'LoginPage',
  mounted() {
    setTimeout(() => {
      if (this.$store.getters['auth/isAuthenticated'] == true) {
        this.$router.push('/home');

        this.$q.notify({
          type: 'positive',
          message: 'Успешная авторизация!',
        });
      } else {
        this.$store.dispatch('error/show', 'У Вас нет доступа');
      }
    }, 1500);
  },
};
</script>
