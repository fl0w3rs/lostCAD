<template>
  <q-layout
    iew="lHh Lpr lFf"
    class="text-white"
    container
    style="min-height: 100vh"
  >

    <q-header
      elevated
      style="background-color: #0b0b0b;"
    >
      <q-toolbar>
        <div class="col-3 text-left q-pl-md">

          <!-- <q-avatar square>
            <router-link to="/home">
              <img
                class="cursor-pointer"
                :src="require('src/assets/footerLogo.png')"
                v-if="isAuthenticated"
              >
            </router-link>
          </!-->
          <q-btn
            flat
            round
            dense
            icon="home"
            v-if="isAuthenticated"
            to="/home"
          />
        </div>

        <div class="col-6">
          <q-toolbar-title class="text-center">LOST CAD</q-toolbar-title>
        </div>

        <div
          class="col-3 text-right q-pr-md"
          v-if="username !== null"
        >
          {{ username }}
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="row">
        <router-view v-slot="{ Component }">
          <transition
            name="scale"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
        <WindowComponent
          v-for="window in windowList"
          v-bind:key="window.id"
          :window="window"
        />
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<style>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.5s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import WindowComponent from 'components/Window.vue';

export default {
  name: 'MainLayout',

  components: { WindowComponent },

  setup() {
    const store = useStore();

    return {
      username: computed(() => store.getters['user/getName']),
      windowList: computed(() => store.getters['window/getWindowList']),
      isAuthenticated: computed(() => store.getters['auth/isAuthenticated']),
    };
  },
};
</script>
