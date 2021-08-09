<template>
  <div class="fire-page full-width text-center">

    <SignalBar/>

    <div class="accentDark q-py-xs q-px-lg">
      <UpperBarComponent />
    </div>

    <div class="accent q-mt-sm q-py-md row justify-center q-gutter-xs">
      <lookup-button :tabs='{ dmv: false, fld: false }' />
      <ten-codes-button />
      <penal-code-button />
    </div>

  </div>
</template>

<script>
import UpperBarComponent from 'src/components/topBar/Main.vue';
import SignalBar from 'src/components/topBar/Signal.vue';
import LookupButton from 'src/components/LookupButton.vue';
import PenalCodeButton from 'src/components/PenalCodeButton.vue';
import TenCodesButton from 'src/components/TenCodesButton.vue';

export default {
  name: 'FirePage',

  components: {
    UpperBarComponent,
    SignalBar,
    LookupButton,
    PenalCodeButton,
    TenCodesButton,
  },
};
</script>
