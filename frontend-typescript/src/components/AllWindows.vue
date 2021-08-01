<template>
  <div style="min-height: inherit; position: absolute;" class="full-width">
    <window v-for="window in windowList()" :key="window.id" :windowData="window" />
  </div>
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
