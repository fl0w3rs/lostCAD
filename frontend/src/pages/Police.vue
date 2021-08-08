<template>
  <div class="police-page full-width text-center">

    <SignalBar/>

    <div class="accentDark q-py-xs q-px-lg">
      <UpperBarComponent />
    </div>

    <div class="accent q-mt-sm q-py-md">
      <UnitStatus />
      <div class="row justify-center q-mt-sm q-gutter-xs">
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

  </div>
</template>

<script>
import UpperBarComponent from 'src/components/nonCivTopBar/Main.vue';
import UnitStatus from 'src/components/unit/Status.vue';
import SignalBar from 'src/components/nonCivTopBar/Signal.vue';
import LookupButton from 'src/components/LookupButton.vue';

export default {
  name: 'PolicePage',

  components: {
    UpperBarComponent, UnitStatus, SignalBar, LookupButton,
  },
};
</script>
