<template>
  <div class="row justify-center">
    <div class="relative-position">
      <div
        class="absolute-center full-width full-height row justify-center"
        style="backdrop-filter: blur(2px); z-index: 1;"
        v-if="!currentUnit"
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

      <div class="q-gutter-xs q-pa-xs">
        <q-btn
          color="white"
          outline
          :label='currentUnit?.callsign || "CALLSIGN"'
          icon="fas fa-balance-scale"
        >
          <q-menu fit>
            <q-list dense>
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

      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, computed } from 'vue';
import { useStore } from 'vuex';
import $socket from 'src/boot/socketio-instance';
import { useQuasar } from 'quasar';

export default {
  setup() {
    const $q = useQuasar();
    const store = useStore();

    const switchStatus = (val) => {
      $socket.emit('unit/setStatus', val);
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

    onBeforeMount(() => { store.dispatch('unit/requestCurrentUnit'); });

    return {
      switchStatus,
      changeCallsign,
      leave,
      disband,
      currentUnit: computed(() => store.getters['unit/getCurrentUnit']),
    };
  },
};
</script>

<style></style>
