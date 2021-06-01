<template>
  <div class="police-page full-width text-center">

    <div class="accentDark q-py-xs q-px-lg">
      <UpperBarComponent />
    </div>

    <div class="accent q-mt-sm q-py-md">
      <UnitStatus />
      <div class="row justify-center q-mt-sm">
        <q-btn
          label="LOOKUP"
          outline
          color="gray"
          @click="$store.commit('window/add', {
            component: 'Lookup',
            windowHeight: 325, title: 'Поиск'
          })"
        />
      </div>
    </div>

  </div>
</template>

<script>
import UpperBarComponent from 'src/components/nonCivTopBar/Main.vue';
import UnitStatus from 'components/UnitStatus.vue';

export default {
  name: 'PolicePage',

  components: { UpperBarComponent, UnitStatus },
};
</script>
