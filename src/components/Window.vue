<template>
    <Vue3DraggableResizable
        :min-width="300" :min-height="150" :w="width" :h="height"
        :style="{position: 'absolute', zIndex: zIndex}"
        :parent="true" class="bg-grey-10 border-maroon-thick position-absolute shadow-3"
        @activated="handleWindowClick" v-if="!getWindow.dialog"
    >
        <q-bar class="accentMaroon">
            <q-icon name="laptop_chromebook" />
            <div>{{window.title}}</div>

            <q-space />

            <q-btn dense flat icon="close" @click="closeWindow">
              <q-tooltip content-class="bg-grey-9 shadow-2">Закрыть</q-tooltip>
            </q-btn>
        </q-bar>
        <q-scroll-area :style="{height: (height - 32 - 4) + 'px'}">
          <component v-if="authInitialized" :is="getWindowComponent"
            v-bind:window="window" v-bind="getWindow.params">
          </component>
        </q-scroll-area>
    </Vue3DraggableResizable>

    <q-dialog
      v-model="getWindow.dialog"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
      v-else
    >
        <q-card
          class="bg-dark text-white border-maroon-thick"
          :style="{minWidth: getWindow.dialogMinWidth}"
        >
            <q-bar class="accentMaroon">
                <q-icon name="laptop_chromebook" />
                <div>{{window.title}}</div>

                <q-space />

                <q-btn dense flat icon="close" @click="closeWindow">
                    <q-tooltip content-class="bg-grey-9 shadow-2">Закрыть</q-tooltip>
                </q-btn>
            </q-bar>

            <q-card-section>
              <component v-if="authInitialized" :is="getWindowComponent"
                v-bind:window="window" v-bind="getWindow.params">
              </component>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style>
  .handle {
    background: transparent!important;
    border: none!important;
    width: 15px;
  }
</style>

<script>
import { ref, computed, defineAsyncComponent } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';

export default {
  name: 'Window',

  props: {
    window: Object,
  },

  setup(params) {
    console.log(`components/${params.window.component}.vue`);
    const store = useStore();
    const $q = useQuasar();

    const zIndex = ref(store.getters['window/getCurrentWindowZ']);

    store.watch(
      (state) => state.window.lastClickedWindowId, (val) => {
        // eslint-disable-next-line eqeqeq
        if (val == params.window.id) {
          zIndex.value = store.getters['window/getCurrentWindowZ'];
        }
      },
    );

    const closeWindow = () => {
      store.commit('window/close', params.window.id);
    };

    const handleWindowClick = () => {
      store.commit('window/click', { id: params.window.id });
    };

    return {
      getWindow: computed(() => params.window),
      // eslint-disable-next-line prefer-template
      getWindowComponent: defineAsyncComponent(() => import('components/' + params.window.component + '.vue')),
      authInitialized: computed(() => store.getters['auth/isAuthInitialized']),

      // eslint-disable-next-line no-nested-ternary
      height: params.window.windowHeight || $q.platform.is.mobile ? 300 : 450,
      width: $q.platform.is.mobile ? 300 : 600,
      zIndex,

      closeWindow,
      handleWindowClick,
    };
  },
};
</script>
