<template>
  <q-layout
    iew="lHh Lpr lFf"
    container
    style="min-height: 100vh"
  >

    <q-header
      elevated
      style="background-color: #0b0b0b;"
    >
      <q-toolbar>
        <div class="col-3 text-left q-pl-md">

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
          <span class="full-height cursor-pointer">
            <q-icon name="fas fa-user"></q-icon>
            {{ username }}
            <q-icon name="fas fa-angle-down"></q-icon>

            <q-menu :offset="[-10, 10]">
              <q-list style="min-width: 100px" dense>
                <q-item @click="openSettings" clickable v-close-popup>
                  <q-item-section avatar>
                    <q-icon color="grey" name="fas fa-cogs" />
                  </q-item-section>
                  <q-item-section>Настройки</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </span>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <div class="full-width text-center q-py-sm text-bold bg-red-10" v-if="!$socket.connected">
          Отсутствует подключение к серверу, весь функционал отключен.
        </div>
        <all-windows />
        <router-view v-slot="{ Component }">
          <transition
            name="scale"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
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
import AllWindows from 'src/components/AllWindows.vue';
import { windowWrapper } from 'src/store/windows/types';

export default {
  name: 'MainLayout',

  components: { AllWindows },

  setup() {
    const store = useStore();

    const openSettings = () => {
      store.commit('windows/open', windowWrapper({
        type: 'dialog',
        component: 'Settings',
        title: 'Настройки',
        initialWidth: '20vw',
      }));
    };

    return {
      username: computed(() => store.getters['user/getName']),
      isAuthenticated: computed(() => store.getters['auth/isAuthenticated']),
      openSettings,
    };
  },
};
</script>
