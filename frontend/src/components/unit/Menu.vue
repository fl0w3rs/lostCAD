<template>
  <q-menu touch-position>
    <q-list dense style="min-width: 100px">
      <q-item @click="dispatchDisband(unit)" clickable v-close-popup>
        <q-item-section>Расформировать</q-item-section>
      </q-item>
      <q-item @click="dispatchSetCallsign(unit)" clickable v-close-popup>
        <q-item-section>Изменить маркировку</q-item-section>
      </q-item>
      <q-item
        @click="dispatchDetachFromCall(unit)"
        v-if="unit.call" clickable v-close-popup
      >
        <q-item-section>Открепить от вызова</q-item-section>
      </q-item>
      <q-item @click="dispatchSwitchPanic(unit)" clickable v-close-popup>
        <q-item-section>
          {{unit.panic ? 'Выключить' : 'Включить'}} панику
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { socketInstance } from 'src/boot/socketio-instance';
import { useQuasar } from 'quasar';

export default defineComponent({
  props: ['unit'],
  setup() {
    const $q = useQuasar();
    const dispatchDisband = (unit) => {
      $q.dialog({
        title: 'Расформирование юнита',
        message: `Вы уверены, что хотите расформировать юнит ${unit.callsign}?`,
        cancel: true,
        persistent: true,
        ok: {
          label: 'Да',
          flat: true,
        },
      }).onOk(() => {
        socketInstance.emit('units:disband', { dispatch: true, unitId: unit.id });
      });
    };

    const dispatchSetCallsign = (unit) => {
      $q.dialog({
        title: 'Изменение маркировки',
        message: 'Введите новую маркировку в поле ниже.',
        prompt: {
          model: unit.callsign,
          type: 'text',
        },
        cancel: true,
        persistent: true,
      }).onOk((data) => {
        socketInstance.emit('units:setCallsign', { dispatch: true, unitId: unit.id, newCallsign: data });
      });
    };

    const dispatchSwitchPanic = (unit) => {
      socketInstance.emit('units:switchPanic', { dispatch: true, unitId: unit.id });
    };

    const dispatchDetachFromCall = (unit) => {
      socketInstance.emit('calls:detachUnit', { unitId: unit.id });
    };

    return {
      dispatchDisband, dispatchDetachFromCall, dispatchSetCallsign, dispatchSwitchPanic,
    };
  },
});
</script>
