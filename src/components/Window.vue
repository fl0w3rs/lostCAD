<template>
    <vue-draggable-resizable
        :min-width="300" :min-height="150" :w="width" :h="height"
        :style="{position: 'absolute', zIndex: zIndex}" @resizing="onResize"
        :parent="true" class-name="bg-grey-10 border-maroon-thick"
        class="position-absolute shadow-3" @activated="handleWindowClick" v-if="!isDialog"
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
    </vue-draggable-resizable>

    <q-dialog
      v-model="isDialog"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
      v-else
    >
        <q-card class="bg-dark text-white border-maroon-thick" :style="{minWidth: dialogMinWidth}">
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
export default {
  name: 'Window',

  props: {
    window: Object,
  },

  computed: {
    getWindow() {
      return this.window;
    },
    getWindowComponent() {
      // eslint-disable-next-line prefer-template
      return () => import('components/' + this.window.component + '.vue');
    },
    authInitialized() {
      return this.$store.getters['auth/isAuthInitialized'];
    },
  },
  data() {
    return {
      // eslint-disable-next-line no-nested-ternary
      height: this.window.windowHeight == null
        ? (this.$q.platform.is.mobile ? 300 : 450)
        : this.window.windowHeight,
      width: this.$q.platform.is.mobile ? 300 : 600,
      zIndex: this.$store.getters['window/getCurrentWindowZ'],
      isDialog: this.window.dialog,
      dialogMinWidth: this.window.dialogMinWidth,
    };
  },
  // watch: {
  //   '$store.getters.window/getLastClickedWindowId': function () {
  //     // eslint-disable-next-line eqeqeq
  //     if (this.$store.getters['window/getLastClickedWindowId'] == this.window.id) {
  //       this.zIndex = this.$store.getters['window/getCurrentWindowZ'];
  //     }
  //   },
  // },
  mounted() {
    this.$store.watch(
      (state) => state.window.getLastClickedWindowId, (val) => {
        // eslint-disable-next-line eqeqeq
        if (val == this.window.id) {
          this.zIndex = this.$store.getters['window/getCurrentWindowZ'];
        }
      },
    );
  },
  methods: {
    closeWindow() {
      this.$store.commit('window/close', this.window.id);
    },

    handleWindowClick() {
      this.$store.commit('window/click', { id: this.window.id });
    },

    onResize(x, y, width, height) {
      this.width = width;
      this.height = height;
    },
  },
};
</script>
