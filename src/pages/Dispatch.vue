<template>
  <div class="dispatch-page full-width text-center">

    <div class="accentDark q-py-xs q-px-lg">
      <UpperBarComponent />
    </div>

    <div class="accent q-mt-sm q-py-md row justify-center q-gutter-xs">
      <q-btn
        label="LOOKUP"
        outline
        color="gray"
        size="sm"
        @click="$store.commit('window/add', {
          component: 'Lookup',
          windowHeight: 325, title: 'Поиск'
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
        label="PENAL CODE"
        outline
        color="gray"
        size="sm"
        @click="
          $store.commit('window/add', {
            component: 'PenalCode',
            title: 'Просмотр Penal Code',
            dialogMinWidth: '60vw',
            dialog: true,
          })
        "
      />
      <q-btn
        label="BOLO"
        outline
        color="gray"
        size="sm"
      />
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

export default {
  name: 'DispatchPage',

  components: { UpperBarComponent, DispatchLog, UnitList },
};
</script>
