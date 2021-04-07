<template>
  <div class="civilian-page full-width text-center">

    <div class="accent q-pa-md">
      <div class="row justify-center q-gutter-xs">

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

          <q-btn
            color="secondary" size="md" icon="far fa-plus-square" outline
            @click="$store.commit('window/add', {
              component: 'civilian/Character', params: { type: 'create' },
              dialog: true, title: 'Создание персонажа',
              dialogMinWidth: '75vw'
            })"
          />
          <q-btn
            color="orange" size="md" icon="fas fa-edit" outline v-if="selectedCharacter != null"
            @click="$store.commit('window/add', {
              component: 'civilian/Character',
              params: { type: 'edit', character: currentCharacter },
              dialog: true, title: 'Редактирование персонажа', dialogMinWidth: '75vw'
            })"
          />

      </div>
      <div class="accentLight q-pa-sm q-mt-sm rounded-borders" v-if="selectedCharacter !== null">
        <Character type="view" :character="currentCharacter" />
      </div>
    </div>

  </div>
</template>

<script>

import Character from 'components/civilian/Character.vue';

export default {
  name: 'CivilianPage',

  components: { Character },

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
  },
};
</script>
