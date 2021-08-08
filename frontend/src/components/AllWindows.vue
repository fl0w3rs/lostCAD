<template>
  <window v-for="window in windowList()" :key="window.id" :windowData="window" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import Window from 'src/components/Window.vue';

export default defineComponent({
  // name: 'ComponentName'
  components: { Window },
  setup() {
    return {
      ...mapGetters({
        windowList: 'windows/getList',
      }),
    };
  },
});
</script>
