<template>
  <q-layout iew="lHh Lpr lFf" class="text-white">

    <q-header elevated style="background-color: #0b0b0b;">
      <q-toolbar>
        <div class="col-3 text-left q-pl-md">
          <q-btn flat round dense icon="menu" />
        </div>

        <div class="col-6">
          <q-toolbar-title class="text-center">LOST CAD</q-toolbar-title>
        </div>

        <div class="col-3 text-right q-pr-md" v-if="username !== null">
          {{ username }}
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="row">
        <router-view></router-view>
        <WindowComponent
          v-for="window in windowList" v-bind:key="window.id" :window="window"
        />
      </q-page>
    </q-page-container>

  </q-layout>
</template>

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
    };
  },
};
</script>
