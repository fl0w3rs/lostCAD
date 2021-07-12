<template>
  <div class="civilian-page full-width text-center">
    <Signal100Bar/>
    <div class="accent q-pa-md non-selectable">
      <div class="row q-col-gutter-xs text-uppercase">
        <div class="col-12 col-sm-4 justify-start">
          <q-select
            dense
            options-dense
            outlined
            v-model="selectedCharacter"
            :options="characterListOptions"
            :style="{ minWidth: '200px' }"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            label="Выбранный персонаж"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section class="text-uppercase">
                  <q-item-label v-html="scope.opt.name" />
                  <q-item-label caption>
                    <small class="text-grey">{{ scope.opt.description }}</small>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div class="col-12 col-sm-4 justify-center">
          <Time />
        </div>

        <div class="col-12 col-sm-4 justify-end">
          <InfoBar />
        </div>
      </div>

      <div class="q-gutter-xs q-mt-sm">
        <q-btn
          color="secondary"
          size="sm"
          icon="far fa-plus-square"
          outline
          label="Создать персонажа"
          @click="
            $store.commit('window/add', {
              component: 'civilian/Character',
              params: { type: 'create' },
              dialog: true,
              title: 'Создание персонажа',
              dialogMinWidth: '75vw',
            })
          "
        />
        <q-btn
          color="orange"
          size="sm"
          icon="fas fa-edit"
          outline
          v-if="selectedCharacter != null"
          label="Отредактировать персонажа"
          @click="
            $store.commit('window/add', {
              component: 'civilian/Character',
              params: { type: 'edit', character: currentCharacter },
              dialog: true,
              title: 'Редактирование персонажа',
              dialogMinWidth: '75vw',
            })
          "
        />
        <q-btn-dropdown
          color="white"
          size="sm"
          icon="fas fa-database"
          outline
          v-if="selectedCharacter != null"
          label="База данных"
        >
          <q-list
            dense
            bordered
            separator
            class="bg-grey-10"
          >
            <q-item
              clickable
              v-close-popup
              @click="
                $store.commit('window/add', {
                  component: 'vehicle/Template',
                  params: { type: 'create' },
                  title: 'Создание Т/С',
                  dialog: true,
                  dialogMinWidth: '60vw',
                })
              "
            >
              <q-item-section>
                <q-item-label>Создать Т/С</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
              @click="
                $store.commit('window/add', {
                  component: 'weapon/Template',
                  params: { type: 'create' },
                  title: 'Создание оружия',
                  dialog: true,
                  dialogMinWidth: '60vw',
                })
              "
            >
              <q-item-section>
                <q-item-label>Создать оружие</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          color="blue"
          size="sm"
          icon="fas fa-list"
          outline
          v-if="selectedCharacter != null"
          label="Записи"
        />
        <q-btn
          color="red"
          size="sm"
          icon="fas fa-phone"
          outline
          v-if="selectedCharacter != null"
          label="911"
          @click="
            $store.commit('window/add', {
              component: 'civilian/Call',
              title: 'Вызов 911',
              dialog: true,
              dialogMinWidth: '40vw',
            })
          "
        />
      </div>
      <q-separator
        class="q-mt-md"
        v-if="selectedCharacter !== null"
      />
      <div v-if="selectedCharacter !== null">
        <Character
          class="q-pa-sm"
          type="view"
          :character="currentCharacter"
        />
        <VehicleList class="q-pa-sm" />
        <WeaponList class="q-pa-sm" />
      </div>
    </div>
  </div>
</template>

<script>
import Character from 'components/civilian/Character.vue';
import VehicleList from 'src/components/vehicle/List.vue';
import WeaponList from 'src/components/weapon/List.vue';
import InfoBar from 'src/components/nonCivTopBar/Info.vue';
import Time from 'src/components/nonCivTopBar/Time.vue';
import Signal100Bar from 'src/components/nonCivTopBar/Signal100.vue';

import {
  ref, onBeforeMount, onBeforeUnmount, computed, watch,
} from 'vue';
import { date } from 'quasar';
import { useStore } from 'vuex';

import $socket from 'src/boot/socketio-instance';

export default {
  name: 'CivilianPage',

  components: {
    Character,
    VehicleList,
    InfoBar,
    WeaponList,
    Time,
    Signal100Bar,
  },

  setup() {
    const store = useStore();

    const rDate = ref('YYYY-MM-DD ddd');
    const rTime = ref('HH:mm:ss');

    const selectedCharacter = ref(store.getters['characters/getSelectedCharacterId']);

    watch(selectedCharacter, (val) => {
      store.commit('characters/updateSelected', val);
    });

    watch(
      () => store.getters['characters/getSelectedCharacterId'],
      (val) => {
        if (selectedCharacter.value !== val) selectedCharacter.value = val;
      },
    );

    const socketWrapper = $socket.initWrapper();

    socketWrapper.listen('user/civilian/characters/deleteSuccess', () => {
      selectedCharacter.value = null;
    });

    onBeforeMount(socketWrapper.mount);
    onBeforeUnmount(socketWrapper.unmount);

    let timeInterval;

    onBeforeMount(() => {
      store.dispatch('characters/request');

      timeInterval = setInterval(() => {
        const now = Date.now();
        rDate.value = date.formatDate(now, 'YYYY-MM-DD ddd', {
          daysShort: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
        });
        rTime.value = date.formatDate(now, 'HH:mm:ss');
      }, 1000);
    });

    onBeforeUnmount(() => {
      clearInterval(timeInterval);
    });

    return {
      rDate,
      rTime,
      characterListOptions: computed(() => store.getters['characters/getCharacterList'].map((val) => ({
        id: val.id,
        name: `${val.name} ${val.surname}`,
        description: val.description,
      }))),
      currentCharacter: computed(() => store.getters['characters/getSelectedCharacter']),
      selectedCharacter,
    };
  },
};
</script>
