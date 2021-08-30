<template>
  <div>
    <q-table
      :columns="columns" :rows="bolos"
      class="bg-transparent" flat
      :pagination="{
        rowsPerPage: 0
      }"
      @row-click="openBoloWindow"
    >
      <template v-slot:body-cell-wanted="props">
        <q-td :props="props">
          <template v-if="props.row.type === 'character'">
            <b>
              {{props.row.characterData.name}} {{props.row.characterData.surname}}
            </b><br/><p class="text-grey">
              Пол: {{props.row.characterData.sex}}<br/>
              Раса: {{props.row.characterData.race}}<br/>
              Цвет волос: {{props.row.characterData.hairColor}}<br/>
              Цвет глаз: {{props.row.characterData.eyeColor}}
            </p>
          </template>

          <template v-if="props.row.type === 'vehicle'">
            <!-- {{props.row}} -->
            <b>
              {{props.row.vehicleData.mark}} {{props.row.vehicleData.model}}
            </b><br/><p class="text-grey">
              Номера: {{props.row.vehicleData.numberplate}}<br/>
              Тип кузова: {{props.row.vehicleData.type}}<br/>
              Цвет: {{props.row.vehicleData.color}}<br/>
              VIN: {{props.row.vehicleData.vin}}
            </p>
          </template>

          <template v-if="props.row.type === 'custom'">
            <!-- {{props.row}} -->
            {{bbCodeParser.parse(props?.row?.data?.shortDescription) || 'Не указано'}}
          </template>
        </q-td>
      </template>

      <template v-slot:body-cell-reason="props">
        <q-td :props="props">
          <template v-for="(article, key) in props.value" :key="key">
            <br v-if="key !== 0"/>{{article?.article}}. {{article?.title}}
          </template>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { SocketWrapper } from 'src/boot/socketio-instance';
import { defineComponent, onBeforeMount, ref } from 'vue';
import bbCodeParser from 'js-bbcode-parser';
import { useStore } from 'vuex';
import { windowWrapper } from 'src/store/windows/types';

const priorityList = {
  low: {
    text: 'Низкий',
    class: 'text-green',
  },
  middle: {
    text: 'Средний',
    class: 'text-orange',
  },
  high: {
    text: 'Высокий',
    class: 'text-red',
  },
};

const typeList = {
  vehicle: 'Транспортное средство',
  character: 'Человек',
  custom: 'Другое',
};

export default defineComponent({
  setup() {
    const socketWrapper = new SocketWrapper();
    const store = useStore();

    const bolos = ref([]);

    socketWrapper.listen('bolos:update', (data: any) => {
      bolos.value = data;
    }, { ignoreWrapperID: true });

    onBeforeMount(() => {
      socketWrapper.emit('bolos:get');
    });

    const openBoloWindow = (evt, row) => {
      store.commit('windows/open', windowWrapper({
        component: 'bolos/Template',
        type: 'dialog',
        initialWidth: '50vw',
        props: { boloData: row, type: 'view' },
      }));
    };

    return {
      bbCodeParser,
      openBoloWindow,

      bolos,
      columns: [
        {
          name: 'id',
          field: 'id',
          label: 'Номер',
          align: 'left',
        },
        {
          name: 'type',
          field: 'type',
          label: 'Тип',
          align: 'center',
          format: (val) => typeList[val] || val,
        },
        {
          name: 'wanted',
          label: 'Объект розыска',
          align: 'center',
        },
        {
          name: 'reason',
          label: 'Причина',
          field: 'reasons',
          align: 'center',
        },
        {
          name: 'priority',
          field: 'priority',
          label: 'Приоритет',
          align: 'right',
          format: (val) => priorityList[val]?.text || val,
          classes: (row) => priorityList[row.priority]?.class || '',
        },
      ],
    };
  },
});
</script>
