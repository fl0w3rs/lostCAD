<template>
  <div class="fire-page full-width text-center">

    <div class="accentDark q-py-xs q-px-lg">
        <UpperBarComponent/>
    </div>

    <div class="accent q-mt-sm q-py-md row justify-center">
      <q-btn label="LOOKUP" outline color="gray"
        @click="$store.commit('window/add', {
          component: 'Lookup',
          params: { types: { dmv: false } },
          windowHeight: 300, title: 'Поиск'
        })"
      />
    </div>

  </div>
</template>

<script>
import UpperBarComponent from 'components/UpperBar.vue';

export default {
  name: 'FirePage',

  components: { UpperBarComponent },
};
</script>
