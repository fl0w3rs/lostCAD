<template>
  <div class="row text-uppercase">
    <div class="col-12">
      <div class="text-left text-bold sectionTitle">ФЛАГИ</div>
      <div class="section q-mt-xs q-pa-xs q-gutter-xs">
        <q-checkbox
          v-model="data.data.flags.armed" label="Вооружен" color="teal"
          :disable="!canEdit"
        />
        <q-checkbox
          v-model="data.data.flags.violent" label="Опасен" color="teal"
          :disable="!canEdit"
        />
        <q-checkbox
          v-model="data.data.flags.mentallyIll" label="Психически болен" color="teal"
          :disable="!canEdit"
        />
      </div>
    </div>
    <div class="col-12 q-mt-sm">
      <div class="text-left text-bold sectionTitle">КОНФИСКАЦИЯ ЛИЦЕНЗИЙ</div>
      <div class="section q-mt-xs q-pa-xs q-gutter-xs">
        <q-checkbox
          v-model="data.data.confiscation.gunLicense" label="Лицензия на оружие" color="teal"
          :disable="!canEdit"
        />
        <q-checkbox
          v-model="data.data.confiscation.hiddenGunLicense"
          label="Лицензия на скрытое ношение оружия" color="teal"
          :disable="!canEdit"
        /><br/>
        <q-checkbox
          v-model="data.data.confiscation.driverLicense" label="Лицензия на вождение" color="teal"
          :disable="!canEdit"
        />
        <q-checkbox
          v-model="data.data.confiscation.pilotLicense" label="Лицензия пилота" color="teal"
          :disable="!canEdit"
        />
        <q-checkbox
          v-model="data.data.confiscation.boatLicense" label="Лодочная лицензия" color="teal"
          :disable="!canEdit"
        />
      </div>
    </div>
    <div class="col-12 q-mt-sm">
      <div class="text-left text-bold sectionTitle">
        ИНФОРМАЦИЯ О ГРАЖДАНСКОМ
        <q-btn
          label="Поиск" outline size="sm"
          icon="search" color="teal" @click="openSelectCharacter"
          v-if="canEdit && !data.characterId"
        />
      </div>
      <div class="section q-mt-xs q-pa-xs q-gutter-xs">
        <character
          type="ncic" :character="characterData" v-if="characterData !== null"
          :hideActionButtons="true" :hideMed="true" :hideLic="true"
        />
        <span class="text-grey" v-else>ПЕРСОНАЖ НЕ УКАЗАН</span>
      </div>
    </div>
    <div class="col-12 q-mt-sm">
      <div class="text-left text-bold sectionTitle">
        НАРУШЕННОЕ ЗАКОНОДАТЕЛЬСТВО
        <q-btn
          label="Добавить из УК" color="green" outline
          v-if="canEdit"
          @click="addReason" size="sm" icon="fas fa-plus"
        />
        <q-btn
          label="Добавить вручную" color="green" outline
          v-if="canEdit" class="q-ml-xs"
          @click="addOwnReason" size="sm" icon="fas fa-plus"
        />
      </div>
      <div class="section q-mt-xs q-pa-xs q-gutter-xs">
        <div
          v-for="(article, key) in data.reasons" :key="key"
          class="accent row"
        >
          <div class="col-12 col-md-1 text-center accent column items-center justify-center">
            #{{key + 1}}
            <q-btn
              label="Удалить" color="red" size="sm" @click="deleteReason(key)" dense
              v-if="canEdit"
            />
          </div>
          <div class="col-12 col-md-11 accent row">
            <div class="col-12 col-md-2">
              <q-input label="Код статьи" dense outlined square v-model="article.article"
                :readonly="!canEdit" />
            </div>
            <div class="col-12 col-md-5">
              <q-input label="Обвинение" dense outlined square v-model="article.title"
                :readonly="!canEdit" />
            </div>
            <div class="col-12 col-md-5">
              <q-input
                v-model="article.violationType"
                dense
                square outlined
                label="Вид нарушения"
                :readonly="!canEdit"
              >
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="article.ticketAmount"
                dense
                label="Сумма штрафа"
                square outlined
                type="number"
                prefix="$"
                :readonly="!canEdit"
              >
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="article.imprisonmentTime"
                dense
                label="Время заключения"
                square outlined
                :readonly="!canEdit"
              >
              </q-input>
            </div>
          </div>
        </div>

        <span class="text-grey" v-if="data.reasons.length === 0">
          Статьи не указаны
        </span>
        <div v-if="calculatedTicketAmount > 0" class="text-bold">
          Сумма штрафа: <span class="text-green">${{ calculatedTicketAmount }}</span>
        </div>
      </div>
    </div>
    <div class="col-12 q-mt-sm">
      <div class="text-left text-bold sectionTitle">
        ЗАМЕТКИ
      </div>
      <div class="q-mt-xs accent">
        <q-input dense outlined square type="textarea" v-model="data.data.notes"
                :readonly="!canEdit">

        </q-input>
      </div>
    </div>
    <div class="col-12 q-mt-sm">
      <div class="text-left text-bold sectionTitle">
        ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ
      </div>
      <div class="section q-mt-xs row">
        <div class="col-12">
          <q-input
            dense outlined square v-model="data.data.additionalInfo.officers"
            label="Участвовавшие офицеры" autogrow
                :readonly="!canEdit" />
        </div>
        <div class="col-12 col-md-6">
          <q-input dense outlined square v-model="data.data.additionalInfo.date" label="Дата"
                :readonly="!canEdit" type="date" stack-label />
        </div>
        <div class="col-12 col-md-6">
          <q-input dense outlined square v-model="data.data.additionalInfo.time" label="Время"
                :readonly="!canEdit" type="time" stack-label />
        </div>
      </div>
    </div>
    <div class="col-12 q-mt-md text-center q-gutter-xs" v-if="type === 'create'">
      <q-btn label="Выписать" color="orange" outline icon="content_paste"
        @click="create"></q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import {
  defineComponent, reactive, ref, watch, onBeforeMount, computed,
} from 'vue';
import Character from 'src/components/civilian/Character.vue';
import { SocketWrapper } from 'src/boot/socketio-instance';
import { useStore } from 'vuex';
import { windowWrapper } from 'src/store/windows/types';
import { useQuasar } from 'quasar';

export default defineComponent({
  props: [
    'arrestData',
    'type',
    'characterId',
    'window',
  ],
  components: { Character },
  setup(props: any) {
    const socketWrapper = new SocketWrapper();
    const store = useStore();
    const $q = useQuasar();

    const canEdit = computed(() => props.type === 'create');

    const data = reactive(_.cloneDeep(props.arrestData) || {});
    if (!data?.data) data.data = {};

    data.characterId = props?.characterId || data?.characterId || null;

    if (!data?.data?.flags) {
      data.data.flags = {
        armed: false,
        violent: false,
        mentallyIll: false,
      };
    }

    if (!data?.data?.confiscation) {
      data.data.confiscation = {
        gunLicense: false,
        hiddenGunLicense: false,
        driverLicense: false,
        pilotLicense: false,
        boatLicense: false,
      };
    }

    if (!data?.data?.additionalInfo) data.data.additionalInfo = {};

    if (!data?.reasons) data.reasons = [];

    const characterData = ref < null | Record<string, unknown> >(null);

    const fetchCharacter = (id) => {
      if (!id) return;

      characterData.value = null;

      socketWrapper.emit('lookup/requestCharacter', { id }).onReturn(
        (payload: any) => {
          characterData.value = payload.data;
        },
      );
    };

    const openSelectCharacter = () => {
      store.commit('windows/open', windowWrapper({
        component: 'Lookup',
        type: 'dialog',
        initialWidth: '50vw',
        props: {
          searchMode: true,
          defaultTab: 'ncic',
          closeOnOverwriteCall: true,
          onNcicRowClickOverwrite: (evt, row) => {
            data.characterId = row.id;
          },
        },
      }));
    };

    const addReason = () => {
      store.commit('windows/open', windowWrapper({
        type: 'dialog',
        component: 'PenalCode',
        initialWidth: '70vw',
        props: {
          hideRowsWithoutImprisonmentTime: true,
          mode: 'select',
          onClick: (row) => {
            data.reasons.push(row);
          },
        },
      }));
    };

    const deleteReason = (key) => {
      data.reasons.splice(key, 1);
    };

    const addOwnReason = () => {
      data.reasons.push({
      });
    };

    watch(() => data.characterId, fetchCharacter);

    onBeforeMount(() => {
      fetchCharacter(data?.characterId || null);
    });

    const calculatedTicketAmount = computed(() => {
      const reasons = data?.reasons || [];
      let amount = 0;

      reasons.forEach((val) => {
        amount += Number(val.ticketAmount) || 0;
      });

      return Number(amount);
    });

    const create = () => {
      socketWrapper.emit('arrests:create', data).onReturn((val) => {
        if (!val) return;
        props.window.doClose();
        $q.notify({
          type: 'positive',
          message: 'Арест успешно выписан.',
        });
      });
    };

    return {
      data,
      characterData,

      openSelectCharacter,

      canEdit,

      addReason,
      addOwnReason,
      deleteReason,

      create,

      calculatedTicketAmount,
    };
  },
});
</script>
