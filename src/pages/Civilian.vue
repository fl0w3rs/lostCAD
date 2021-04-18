<template>
  <div class="civilian-page full-width text-center">

    <div class="accent q-pa-md">
      <div class="row q-col-gutter-xs">
        <div class="col-4 justify-start">
          <q-select
            dense options-dense dark outlined v-model="selectedCharacter"
            :options="characterListOptions" :style="{minWidth: '200px'}"
            option-value="id" option-label="name"
            emit-value map-options label="Выбранный персонаж"
          >
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section>
                    <q-item-label v-html="scope.opt.name"></q-item-label>
                    <q-item-label class="text-grey" caption>
                      {{ scope.opt.description }}
                    </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

        </div>

        <div class="col-4 justify-center">
          <div class="clock">
            <p>{{rDate}}</p>
            <p>{{rTime}}</p>
          </div>
        </div>

        <div class="col-4 justify-end">
          <GameZone/>
        </div>

      </div>

      <div class="q-gutter-xs q-mt-sm">
        <q-btn
          color="secondary" size="sm" icon="far fa-plus-square" outline
          label="Создать персонажа"
          @click="$store.commit('window/add', {
            component: 'civilian/Character', params: { type: 'create' },
            dialog: true, title: 'Создание персонажа',
            dialogMinWidth: '75vw'
          })"
        />
        <q-btn
          color="orange" size="sm" icon="fas fa-edit" outline v-if="selectedCharacter != null"
          label="Отредактировать персонажа"
          @click="$store.commit('window/add', {
            component: 'civilian/Character',
            params: { type: 'edit', character: currentCharacter },
            dialog: true, title: 'Редактирование персонажа', dialogMinWidth: '75vw'
          })"
        />

      </div>
      <q-separator class="q-mt-md" dark v-if="selectedCharacter !== null" />
      <div v-if="selectedCharacter !== null">
        <Character type="view" :character="currentCharacter" />
        <VehicleList/>
      </div>
    </div>

  </div>
</template>

<script>

import Character from 'components/civilian/Character.vue';
import VehicleList from 'components/civilian/VehicleList.vue';
import GameZone from 'components/GameZone.vue';

import { ref, onBeforeMount, onBeforeUnmount } from 'vue';
import { date } from 'quasar';

export default {
  name: 'CivilianPage',

  components: { Character, VehicleList, GameZone },

  setup() {
    const rDate = ref('YYYY-MM-DD ddd');
    const rTime = ref('HH:mm:ss');

    let timeInterval;

    onBeforeMount(() => {
      timeInterval = setInterval(() => {
        const now = Date.now();
        rDate.value = date.formatDate(now, 'YYYY-MM-DD ddd', {
          daysShort: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
        });
        rTime.value = date.formatDate(now, 'HH:mm:ss');
      }, 1000);
    });

    onBeforeUnmount(() => {
      clearInterval(timeInterval);
    });

    return { rDate, rTime };
  },

  computed: {
    characterListOptions() {
      return this.$store.getters['characters/getCharacterList'].map((val) => ({ id: val.id, name: `${val.name} ${val.surname}`, description: val.description }));
    },

    currentCharacter() {
      return this.$store.getters['characters/getSelectedCharacter'];
    },
  },

  data() {
    return {
      selectedCharacter: null,
    };
  },

  watch: {
    selectedCharacter(val) {
      this.$store.commit('characters/updateSelected', val);
    },
  },

  sockets: {
    'user/civilian/characters/deleteSuccess': function () {
      this.selectedCharacter = null;
    },
  },

  mounted() {
    this.$store.dispatch('characters/request');
    this.$store.dispatch('characters/requestVehicles');
  },
};
</script>
