<template>
  <div class="dispatch-page full-width text-center">

    <Signal100Bar />

    <div class="accentDark q-py-xs q-px-lg">
      <UpperBarComponent />
    </div>

    <div class="accent column items-center q-mt-sm q-py-md row justify-center">
      <div class="row q-gutter-xs">
        <q-btn
          label="СИГНАЛ 100"
          outline
          :color="signal100status == 1 ? 'red' : 'gray'"
          @click="switchSignal100"
        />
        <q-btn
          label="ПРИОРИТЕТ"
          outline
          :color="priorityStatus == 1 ? 'light-blue' : 'gray'"
          @click="switchPriority"
        />
      </div>
      <div class="row q-mt-xs q-gutter-xs">
        <q-btn
          label="БАЗА ДАННЫХ"
          outline
          color="gray"
          size="sm"
          @click="$store.commit('window/add', {
            component: 'Lookup',
            windowHeight: 400, title: 'Поиск',
          windowWidth: 800,
          })"
        />
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
import Signal100Bar from 'src/components/nonCivTopBar/Signal100.vue';
import $socket from 'src/boot/socketio-instance';
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  name: 'DispatchPage',

  components: {
    UpperBarComponent, DispatchLog, UnitList, Signal100Bar,
  },

  setup() {
    const store = useStore();

    const switchSignal100 = () => {
      $socket.emit('dispatch/switchSignal100');
    };

    const switchPriority = () => {
      $socket.emit('dispatch/switchPriority');
    };

    return {
      switchSignal100,
      signal100status: computed(() => store.getters['other/getSignal100']),
      switchPriority,
      priorityStatus: computed(() => store.getters['other/getPriority']),
    };
  },
};
</script>
