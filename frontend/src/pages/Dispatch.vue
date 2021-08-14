<template>
  <div class="dispatch-page full-width text-center">

    <signal-bar />

    <div class="accentDark q-py-xs q-px-lg">
      <UpperBarComponent />
    </div>

    <div class="accent column items-center q-mt-sm q-py-md row justify-center">
      <div class="row q-gutter-xs">
        <q-btn
          label="СИГНАЛ"
          outline
          :color="'gray'"
          @click="switchSignal"
        />
        <priority-button />
      </div>
      <div class="row q-mt-xs q-gutter-xs">
        <lookup-button />
        <ten-codes-button />
        <penal-code-button />
        <q-btn
          label="РОЗЫСК"
          outline
          color="gray"
          size="sm"
        />

      </div>
    </div>

    <div class="q-mt-sm row q-col-gutter-xs text-left">
      <div class="col-6">
        <div class="accent q-pa-sm">
          <p class="text-h6 q-mb-sm">Список звонков</p>
          <call-list />
        </div>
      </div>
      <div class="col-6">
        <div class="accent q-pa-sm">
          <p class="text-h6 q-mb-sm">Список юнитов</p>
          <UnitList type="dispatch" />
        </div>
        <div class="accent q-mt-sm q-pa-sm">
          <DispatchLog />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import UpperBarComponent from 'src/components/topBar/Main.vue';
import DispatchLog from 'src/components/dispatch/Log.vue';
import UnitList from 'src/components/unit/List.vue';
import SignalBar from 'src/components/topBar/Signal.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
import LookupButton from 'src/components/LookupButton.vue';
import PenalCodeButton from 'src/components/PenalCodeButton.vue';
import PriorityButton from 'src/components/PriorityButton.vue';
import TenCodesButton from 'src/components/TenCodesButton.vue';
import { windowWrapper } from 'src/store/windows/types';
import CallList from 'src/components/calls/List.vue';

export default {
  name: 'DispatchPage',

  components: {
    UpperBarComponent,
    DispatchLog,
    UnitList,
    SignalBar,
    PriorityButton,
    LookupButton,
    PenalCodeButton,
    TenCodesButton,
    CallList,
  },

  setup() {
    const store = useStore();

    const switchSignal = () => {
      store.commit('windows/open', windowWrapper({
        component: 'dispatch/EditSignal',
        title: 'Редактирование сигнала',
        type: 'dialog',
      }));
    };

    return {
      switchSignal,
      signalStatus: computed(() => store.getters['other/getSignal']),
    };
  },
};
</script>
