<template>
  <div class="row justify-center q-gutter-xs">
    <q-btn
      :color="status == '7' ? 'orange' : 'grey'"
      @click="switchStatus('7')"
      outline
      label="КОД 7"
    />
    <q-btn
      :color="status == '8' ? 'red' : 'grey'"
      @click="switchStatus('8')"
      outline
      label="КОД 8"
    />
    <q-btn
      :color="status == '9' ? 'cyan' : 'grey'"
      @click="switchStatus('9')"
      outline
      label="КОД 9"
    />
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const status = ref(null);

    const switchStatus = (val) => {
      if (status.value === val) {
        status.value = null;
        return;
      }

      status.value = val;
    };

    return {
      status,
      switchStatus,
    };
  },
};
</script>

<style></style>
