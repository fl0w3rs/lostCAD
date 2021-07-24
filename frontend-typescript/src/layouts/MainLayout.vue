<template>
  <q-layout view="lHh Lpr lFf">
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
            to="/home"
          />
          <!-- v-if="isAuthenticated" -->
        </div>

        <div class="col-6">
          <q-toolbar-title class="text-center">LOST CAD</q-toolbar-title>
        </div>

        <div
          class="col-3 text-right q-pr-md"

        >
        <!-- v-if="username !== null" -->
          fl0w3rs
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
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

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    return {};
  },
});
</script>
