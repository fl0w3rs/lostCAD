<template>
  <div class="row justify-center">
    <div class="relative-position">
      <div
        class="absolute-center full-width full-height row justify-center"
        style="backdrop-filter: blur(2px); z-index: 1;"
        v-if="!currentUnit && selectedIdentifier"
      >
        <div class="text-bold column justify-center">
          <div class="column">
            <p>ВЫ НЕ НА СМЕНЕ</p>
            <small>
              <span
                class="text-green cursor-pointer"
                @click="$store.commit('window/add', {
                  component: 'unit/Create',
                  dialog: true, dialogMinWidth: '20vw',
                  title: `Создание юнита`,
                });"
              >СОЗДАЙТЕ ЮНИТ</span>
              ИЛИ
              <span
                class="text-blue cursor-pointer"
                @click="$store.commit('window/add', {
                  component: 'unit/List',
                  dialog: true, dialogMinWidth: '40vw',
                  params: { type: 'join' },
                  title: `Присоединиться к существующему`,
                });"
              >ПРИСОЕДИНИТЕСЬ К СУЩЕСТВУЮЩЕМУ</span>
            </small>
          </div>
        </div>
      </div>

      <div
        class="absolute-center full-width full-height row justify-center"
        style="backdrop-filter: blur(2px); z-index: 1;"
        v-if="!selectedIdentifier"
      >
        <div class="text-bold column justify-center">
          <div class="column">
            <p>ФУНКЦИОНАЛ ЮНИТА НЕДОСТУПЕН, ВЫБЕРИТЕ ИДЕНТИФИКАТОР</p>
          </div>
        </div>
      </div>

      <div
        class="absolute-center full-width full-height row justify-center blink-bg"
        v-if="currentUnit.panic"
      >
      </div>

      <div class="q-gutter-xs q-pa-xs">
        <q-btn
          color="white"
          outline
          :label='currentUnit?.callsign || "CALLSIGN"'
          icon="fas fa-balance-scale"
        >
          <q-tooltip
            class="text-uppercase" anchor="top middle" self="bottom middle" :offset="[10, 10]"
          >
            <b>Участники:</b>
            <p v-for="identifier in currentUnit.members" :key="identifier.id">
              [{{identifier.callsign}}] {{identifier.name}}
            </p>
          </q-tooltip>
          <q-menu fit>
            <q-list dense>
              <q-item clickable @click="$store.commit('window/add', {
                  component: 'unit/Log',
                  title: `Лог юнита`,
                  windowHeight: 300
                });">
                <q-item-section>Открыть лог юнита</q-item-section>
              </q-item>
              <q-item clickable @click="changeCallsign">
                <q-item-section>Изменить маркировку</q-item-section>
              </q-item>
              <q-separator></q-separator>
              <q-item clickable @click="leave">
                <q-item-section>Покинуть юнит</q-item-section>
              </q-item>
              <q-item clickable @click="disband">
                <q-item-section>Расформировать</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn
          :color="currentUnit?.status == 'busy' ? 'orange' : 'grey'"
          @click="switchStatus('busy')"
          outline
          class="q-ml-md"
          label="Занят"
        />
        <q-btn
          :color="currentUnit?.status == 'unavail' ? 'red' : 'grey'"
          @click="switchStatus('unavail')"
          outline
          label="Недоступен"
        />
        <q-btn
          :color="currentUnit?.status == 'avail' ? 'cyan' : 'grey'"
          @click="switchStatus('avail')"
          outline
          label="Доступен"
        />
        <q-btn
          :color="currentUnit?.status == 'enroute' ? 'blue' : 'grey'"
          @click="switchStatus('enroute')"
          outline
          class="q-ml-md"
          label="В пути"
        />
        <q-btn
          :color="currentUnit?.status == 'onscene' ? 'green' : 'grey'"
          @click="switchStatus('onscene')"
          outline
          label="На сцене"
        />

        <q-btn
          :color="currentUnit?.panic ? 'red' : 'grey'"
          @click="switchPanic"
          outline
          class="q-ml-md"
          label="Паника"
        />

        <priority-button />

      </div>
    </div>
  </div>
</template>

<style>
.blink-bg{
  border-radius: 5px;
  animation: blinkingBackground 2s infinite;
}
@keyframes blinkingBackground{
  0%  { background-color: rgba(143, 8, 8, 1);}
  50% { background-color: rgba(255, 99, 71, 0);}
  100%  { background-color: rgba(143, 8, 8, 1);}
}
</style>

<script>
import { onBeforeMount, computed } from 'vue';
import { useStore } from 'vuex';
import $socket from 'src/boot/socketio-instance';
import { useQuasar } from 'quasar';
import PriorityButton from '../PriorityButton.vue';

export default {
  components: { PriorityButton },
  setup() {
    const $q = useQuasar();
    const store = useStore();

    const switchStatus = (val) => {
      $socket.emit('unit/setStatus', val);
    };

    const switchPanic = () => {
      $socket.emit('unit/switchPanic', null);
    };

    const changeCallsign = () => {
      $q.dialog({
        title: 'Изменение маркировки',
        message: 'Введите новую маркировку в поле ниже.',
        prompt: {
          model: '',
          type: 'text',
        },
        cancel: true,
        persistent: true,
      }).onOk((data) => {
        $socket.emit('unit/setCallsign', data);
      });
    };

    const leave = () => {
      $q.dialog({
        title: 'Покидание юнита',
        message: 'Вы уверены, что хотите покинуть юнит?',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        $socket.emit('unit/leave', null);
      });
    };

    const disband = () => {
      $q.dialog({
        title: 'Расформирование юнита',
        message: 'Вы уверены, что хотите расформировать юнит?',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        $socket.emit('unit/disband', null);
      });
    };

    onBeforeMount(() => {
      store.dispatch('unit/requestAllUnits');
      store.dispatch('other/requestSignal');
    });

    return {
      switchStatus,
      changeCallsign,
      leave,
      disband,
      switchPanic,
      currentUnit: computed(() => store.getters['unit/getCurrentUnit']),
      selectedIdentifier: computed(() => store.getters['identifier/getSelectedIdentifierObject']),
    };
  },
};
</script>

<style></style>
