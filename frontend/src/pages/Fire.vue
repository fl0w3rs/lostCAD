<template>
  <div class="fire-page full-width text-center">

    <SignalBar/>

    <div class="accentDark q-py-xs q-px-lg">
      <UpperBarComponent />
    </div>

    <div class="accent q-mt-sm q-py-md row justify-center q-gutter-xs">
      <lookup-button :tabs='{ dmv: false, fld: false }' />
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
    </div>

  </div>
</template>

<script>
import UpperBarComponent from 'src/components/nonCivTopBar/Main.vue';
import SignalBar from 'src/components/nonCivTopBar/Signal.vue';
import LookupButton from 'src/components/LookupButton.vue';

export default {
  name: 'FirePage',

  components: { UpperBarComponent, SignalBar, LookupButton },
};
</script>
