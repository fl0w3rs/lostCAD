<template>
  <div>
    <q-list>
      <q-item>
        <q-item-section avatar>
          <q-icon color="teal" name="volume_up">
            <q-tooltip anchor="top middle" self="center middle">
              Громкость
            </q-tooltip>
          </q-icon>
        </q-item-section>
        <q-item-section>
          <q-slider
            v-model="volume"
            :label-value="Math.round(volume * 100) + '%'"
            label-always color="teal"
            @change="updateVolume"
            :min="0" :max="1" :step="0.01"
          />
        </q-item-section>
      </q-item>

    </q-list>
  </div>
</template>

<script lang="ts">
import { LocalStorage } from 'quasar';
import { defineComponent, ref } from 'vue';
import { Howler } from 'howler';

export default defineComponent({
  setup() {
    const volume = ref(LocalStorage.getItem('volume') || 0.5);
    const updateVolume = (val) => {
      if (val < 0 || val > 1) {
        volume.value = 0.5;
        val = 0.5;
      }

      LocalStorage.set('volume', val);
      Howler.volume(val);
    };

    return { volume, updateVolume };
  },
});
</script>
