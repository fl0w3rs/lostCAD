<template>
  <div
    class="login-page column items-center justify-center full-width"
    style="min-height: inherit;"
  >
    <q-img
      :src="require('src/assets/images/logo.png')"
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
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
/* eslint-disable eqeqeq */
export default {
  name: 'LoginPage',
  setup() {
    const store = useStore();
    const router = useRouter();
    const $q = useQuasar();

    onMounted(() => {
      setTimeout(() => {
        if (store.getters['auth/isAuthenticated'] == true) {
          router.push('/home');

          $q.notify({
            type: 'positive',
            message: 'Успешная авторизация!',
          });
        } else {
          store.dispatch('error/show', { message: 'У Вас нет доступа' });
        }
      }, 1500);
    });
  },
};
</script>
