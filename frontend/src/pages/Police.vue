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
        <bolos-button />
        <new-record-button />
        <self-dispatch-button />

      </div>
    </div>

    <div class="q-mt-sm">
      <div class="row q-col-gutter-xs">
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
        <div class="col-12 col-md-6">
          <div class="accent q-pa-sm">
            <unit-list :type="selfDispatchStatus ? 'dispatch' : 'view'" />
          </div>
          <div class="accent q-pa-sm q-mt-xs">
            <call-list :isDispatch="!!selfDispatchStatus" />
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
import BolosButton from 'src/components/bolos/Button.vue';
import CallView from 'src/components/calls/View.vue';
import UnitList from 'src/components/unit/List.vue';
import CallList from 'src/components/calls/List.vue';
import SelfDispatchButton from 'src/components/SelfDispatchButton.vue';
import NewRecordButton from 'src/components/NewRecordButton.vue';

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
    BolosButton,
    CallView,
    UnitList,
    CallList,
    SelfDispatchButton,
    NewRecordButton,
  },

  setup() {
    const store = useStore();
    return {
      currentUnit: computed(() => store.getters['unit/getCurrentUnit']),
      selfDispatchStatus: computed(() => store.getters['other/getSelfDispatchStatus']),
    };
  },
};
</script>
