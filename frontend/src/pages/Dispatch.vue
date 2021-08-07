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
        <q-btn
          label="10-КОДЫ"
          outline
          color="gray"
          size="sm"
          @click="
            $store.commit('window/add', {
              component: 'TenCodes',
              title: 'Просмотр 10-кодов',
              dialogMinWidth: '30vw',
              dialog: true,
            })
          "
        />
        <q-btn
          label="Уголовный кодекс"
          outline
          color="gray"
          size="sm"
          @click="
            $store.commit('window/add', {
              component: 'PenalCode',
              title: 'Просмотр Уголовного кодекса',
              dialogMinWidth: '70vw',
              dialog: true,
            })
          "
        />
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
          <DispatchLog />
        </div>
      </div>
      <div class="col-6">
        <div class="accent q-pa-sm">
          <p class="text-h6 q-mb-sm">Список юнитов</p>
          <UnitList />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import UpperBarComponent from 'src/components/nonCivTopBar/Main.vue';
import DispatchLog from 'src/components/dispatch/Log.vue';
import UnitList from 'src/components/unit/List.vue';
import SignalBar from 'src/components/nonCivTopBar/Signal.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
import LookupButton from 'src/components/LookupButton.vue';
import PriorityButton from '../components/PriorityButton.vue';

export default {
  name: 'DispatchPage',

  components: {
    UpperBarComponent,
    DispatchLog,
    UnitList,
    SignalBar,
    PriorityButton,
    LookupButton,
  },

  setup() {
    const store = useStore();

    const switchSignal = () => {
      store.commit('window/add', {
        component: 'dispatch/EditSignal',
        title: 'Редактирование сигнала',
        dialog: true,
      });
    };

    return {
      switchSignal,
      signalStatus: computed(() => store.getters['other/getSignal']),
    };
  },
};
</script>
