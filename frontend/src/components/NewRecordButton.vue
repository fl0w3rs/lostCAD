<template>
  <q-btn-dropdown label="Новая запись" size="sm" outline>
    <q-list dense>
      <q-item clickable v-close-popup @click="openCitationWindow">
        <q-item-section avatar>
          <q-icon name="fa fa-ticket-alt" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Штраф</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-close-popup @click="openArrestWindow">
        <q-item-section avatar>
          <q-icon name="content_paste" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Арест</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script lang="ts">
import { windowWrapper } from 'src/store/windows/types';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();

    const openCitationWindow = () => {
      store.commit('windows/open', windowWrapper({
        type: 'dialog',
        component: 'citations/Template',
        initialWidth: '50vw',
        props: {
          type: 'create',
        },
      }));
    };
    const openArrestWindow = () => {
      store.commit('windows/open', windowWrapper({
        type: 'dialog',
        component: 'arrests/Template',
        initialWidth: '50vw',
        props: {
          type: 'create',
        },
      }));
    };

    return { openCitationWindow, openArrestWindow };
  },
});
</script>
