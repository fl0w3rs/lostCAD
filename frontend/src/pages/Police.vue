<template>
  <div class="police-page full-width">

    <SignalBar/>

    <div class="accentDark q-py-xs q-px-lg text-center">
      <UpperBarComponent />
    </div>

    <div class="accent q-mt-sm q-py-md">
      <UnitStatus />
      <div class="row justify-center q-mt-xs q-gutter-xs">
        <lookup-button />
        <ten-codes-button />
        <penal-code-button />
        <q-btn
          label="РОЗЫСК"
          outline
          size="sm"
        />
      </div>
    </div>

    <div class="q-mt-sm">
      <div class="row">
        <div class="col-12 col-md-6">
          <div class="accent q-pa-sm relative-position">
            <div
              class="absolute-center full-width full-height row justify-center"
              style="backdrop-filter: blur(2px); z-index: 1;"
              v-if="!currentUnit?.call"
            >
              <div class="text-bold column justify-center">
                <div class="column">
                  <p>ВЫ НЕ ПРИКРЕПЛЕНЫ К ВЫЗОВУ</p>
                </div>
              </div>
            </div>
            <p class="text-h6 q-mb-sm">Вызов #{{currentUnit?.call?.id || '666'}}</p>
            <call-view type="view" :callData="currentUnit?.call || {}" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import UpperBarComponent from 'src/components/topBar/Main.vue';
import UnitStatus from 'src/components/unit/Status.vue';
import SignalBar from 'src/components/topBar/Signal.vue';
import LookupButton from 'src/components/LookupButton.vue';
import PenalCodeButton from 'src/components/PenalCodeButton.vue';
import TenCodesButton from 'src/components/TenCodesButton.vue';

import CallView from 'src/components/calls/View.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  name: 'PolicePage',

  components: {
    UpperBarComponent,
    UnitStatus,
    SignalBar,
    LookupButton,
    PenalCodeButton,
    TenCodesButton,

    CallView,
  },

  setup() {
    const store = useStore();
    return {
      currentUnit: computed(() => store.getters['unit/getCurrentUnit']),
    };
  },
};
</script>
