<template>
  <div class="police-page full-width text-center">

    <SignalBar/>

    <div class="accentDark q-py-xs q-px-lg">
      <UpperBarComponent />
    </div>

    <div class="accent q-mt-sm q-py-md">
      <UnitStatus />
      <div class="row justify-center q-mt-xs q-gutter-xs">
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

  </div>
</template>

<script>
import UpperBarComponent from 'src/components/topBar/Main.vue';
import UnitStatus from 'src/components/unit/Status.vue';
import SignalBar from 'src/components/topBar/Signal.vue';
import LookupButton from 'src/components/LookupButton.vue';
import PenalCodeButton from 'src/components/PenalCodeButton.vue';
import TenCodesButton from 'src/components/TenCodesButton.vue';

export default {
  name: 'PolicePage',

  components: {
    UpperBarComponent,
    UnitStatus,
    SignalBar,
    LookupButton,
    PenalCodeButton,
    TenCodesButton,
  },
};
</script>
