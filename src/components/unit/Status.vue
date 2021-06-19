<template>
  <div class="row justify-center">
    <div class="relative-position">
      <div
        class="absolute-center z-top full-width full-height row justify-center"
        style="backdrop-filter: blur(2px)"
      >
        <div class="text-bold column justify-center">
          <div class="column">
            <p>ВЫ НЕ НА СМЕНЕ</p>
            <small>
              <span class="text-green cursor-pointer">СОЗДАЙТЕ ЮНИТ</span>
              ИЛИ
              <span class="text-blue cursor-pointer">ПРИСОЕДИНИТЕСЬ К СУЩЕСТВУЮЩЕМУ</span>
            </small>
          </div>
        </div>
      </div>

      <div class="q-gutter-xs q-pa-xs">
        <q-btn
          :color="status == 'busy' ? 'orange' : 'grey'"
          @click="switchStatus('busy')"
          outline
          label="Занят"
        />
        <q-btn
          :color="status == 'unavail' ? 'red' : 'grey'"
          @click="switchStatus('unavail')"
          outline
          label="Недоступен"
        />
        <q-btn
          :color="status == 'avail' ? 'cyan' : 'grey'"
          @click="switchStatus('avail')"
          outline
          label="Доступен"
        />
        <q-btn
          :color="status == 'enroute' ? 'blue' : 'grey'"
          @click="switchStatus('enroute')"
          outline
          class="q-ml-md"
          label="В пути"
        />
        <q-btn
          :color="status == 'onscene' ? 'green' : 'grey'"
          @click="switchStatus('onscene')"
          outline
          label="На сцене"
        />

      </div>
    </div>
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
