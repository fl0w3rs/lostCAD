<template>
  <!-- <div></div> -->
  <Vue3DraggableResizable
    v-if="windowData.type === 'draggable'"
    :parent="true" :initW="width" :initH="height"
    v-model:x="posX" v-model:y="posY"
    v-model:h="height" v-model:w="width"
    :minW="300" :minH="150"
    @activated="onActivated" class="shadow-3"
    :style="{ zIndex: windowData.zIndex }"
  >
    <q-bar class="bg-maroon">
      <q-icon name="laptop_chromebook" />
      <div class="ellipsis">{{ windowData.title || 'Google Chrome' }}</div>

      <q-space />

      <q-btn dense flat icon="close" @click="closeWindow">
        <q-tooltip content-class="bg-grey-9 shadow-2">Закрыть</q-tooltip>
      </q-btn>
    </q-bar>
    <q-scroll-area
      :style="{ height: (height - 32) + 'px' }"
      class="bg-grey-10 border-maroon-thick"
    >
      <component
        :is="getWindowComponent"
        v-bind:window="windowData"
        v-bind="windowData.props"
        class="q-pa-sm"
      />
    </q-scroll-area>
  </Vue3DraggableResizable>

  <q-dialog
    persistent
    v-model="dialog"
    transition-show="slide-up"
    transition-hide="slide-down"
    v-if="windowData.type === 'dialog'"
  >
    <q-card class="border-maroon-thick" :style="{minWidth: dialogWidth}">
      <q-bar class="bg-maroon">
        <q-icon name="laptop_chromebook" />
        <div class="ellipsis">{{windowData.title || 'Google Chrome'}}</div>

        <q-space />

        <q-btn dense flat icon="close" @click="closeWindow">
          <q-tooltip content-class="bg-grey-9 shadow-2">Закрыть</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <component
          :is="getWindowComponent"
          v-bind:window="windowData"
          v-bind="windowData.props"
        >
        </component>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style>
  .handle {
    background: transparent!important;
    border: none!important;
  }

  .vdr-container {
    border: none!important;
  }
</style>

<script lang="ts">
import Vue3DraggableResizable from 'vue3-draggable-resizable';
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';
import {
  defineComponent, ref, onBeforeMount, PropType, defineAsyncComponent,
} from 'vue';
import { scroll } from 'quasar';
import type { IWindow } from 'src/store/windows/types';
import { useStore } from 'vuex';

const { getVerticalScrollPosition } = scroll;

const transformSizeToPixelInteger = (size: string): number => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const suffix = size.slice(-2);
  const number = Number(size.substr(0, size.length - 2));

  if (suffix === 'px') return number;
  if (suffix === 'vw') return (number / 100) * windowWidth;
  if (suffix === 'vh') return (number / 100) * windowHeight;

  return 0;
};

const tstpi = transformSizeToPixelInteger;

export default defineComponent({
  // name: 'ComponentName'
  components: { Vue3DraggableResizable },
  props: {
    windowData: {
      type: Object as PropType<IWindow>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const theWindow = ref<IWindow>(props.windowData);

    // draggable part
    let initialWidth = theWindow.value.initialWidth || '400px';
    const initialHeight = theWindow.value.initialHeight || '300px';

    if (theWindow.value.type === 'draggable') {
      if (tstpi(initialWidth) > window.innerWidth) initialWidth = `${window.innerWidth}px`;
    }

    const width = ref<number>(tstpi(initialWidth));
    const height = ref<number>(tstpi(initialHeight));

    const posX = ref(0);
    const posY = ref(0);

    onBeforeMount(() => {
      posX.value = (window.innerWidth / 2) - (tstpi(initialWidth) / 2);
      posY.value = getVerticalScrollPosition(window) - 50
        + (window.innerHeight / 2)
        - (tstpi(initialHeight) / 2);
    });

    const onActivated = () => {
      store.commit('windows/click', theWindow.value.id);
    };

    // dialog part
    const dialogWidth = theWindow.value.initialWidth || null;

    // shared part

    const closeWindow = () => {
      store.commit('windows/close', theWindow.value.id);
    };

    return {
      // = draggable part
      width,
      height,
      posX,
      posY,
      onActivated,
      // = dialog part
      dialog: true,
      dialogWidth,
      // = shared part
      getWindowComponent: defineAsyncComponent(() => import(
        /* webpackMode: "lazy-once" */
        `components/${theWindow.value.component}.vue`
      )),
      closeWindow,
    };
  },
});
</script>
