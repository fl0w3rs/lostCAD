<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-6">
        <q-input
          dense
          square
          outlined
          v-model="info.name"
          label="Название"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-select
          dense
          options-dense
          square
          outlined
          v-model="info.type"
          label="Тип департамента"
          :options="departmentTypeList"
        />
      </div>
      <div class="col-12">
        <q-input
          dense
          square
          outlined
          v-model="info.divisions"
          label="Список дивизий (разделять через |||)"
          autogrow
        />
      </div>
      <div class="col-12">
        <q-select
          dense
          options-dense
          square
          outlined
          v-model="info.groups"
          emit-value
          map-options
          multiple
          label="Группы с доступом"
          :options="groupList"
        />
      </div>
    </div>

    <div
      class="full-width q-mt-sm row justify-center"
      v-if="type == 'create' || type == 'edit'"
    >
      <q-btn
        v-if="type == 'create'"
        color="green"
        outline
        class="shadow-2"
        @click="create"
        icon="fas fa-plus"
        label="Создать"
      />

      <div
        class="row q-gutter-sm justify-center"
        v-if="type == 'edit'"
      >
        <q-btn
          color="green"
          outline
          class="shadow-2"
          @click="save"
          icon="fas fa-save"
          label="Сохранить"
        />
        <q-btn
          color="red"
          outline
          class="shadow-2"
          @click="remove"
          icon="fas fa-trash-alt"
          label="Удалить"
        />

      </div>
    </div>
  </div>
</template>

<script>
import {
  ref, watch, onBeforeMount,
} from 'vue';
import { departmentTypeList } from 'src/utils/constants';
import { getAllGroupNames } from 'src/utils/api';
import { SocketWrapper } from 'src/boot/socketio-instance';

export default {
  props: {
    type: String,
    dept: Object,
    window: Object,
  },

  setup(props) {
    const socketWrapper = new SocketWrapper();

    const info = ref({ ...props.dept });
    watch(() => props.dept, (val) => { info.value = val; });

    const groupList = ref([]);

    onBeforeMount(async () => {
      const resp = await getAllGroupNames();
      for (let i = 0; i < resp.length; i += 1) {
        groupList.value.push({ label: resp[i].name, value: resp[i].id });
      }

      if (props.type !== 'create') {
        info.value.groups = info.value.groups.split(',').map((i) => Number(i));
      }
    });

    const generateFinalVar = () => {
      const data = { ...info.value };
      data.groups = data?.groups?.join(',') || '';
      if (!data.divisions) data.divisions = '';
      return data;
    };

    const closeAndRefetch = () => {
      socketWrapper.emit('admin/departments/getAll');
      props.window.doClose();
    };

    const create = () => {
      const data = generateFinalVar();
      socketWrapper.emit('admin/departments/create', data).onReturn((payload) => {
        if (payload === 'success') closeAndRefetch();
      });
    };

    const save = () => {
      const data = generateFinalVar();
      socketWrapper.emit('admin/departments/edit', data).onReturn((payload) => {
        if (payload === 'success') closeAndRefetch();
      });
    };

    const remove = () => {
      socketWrapper.emit('admin/departments/delete', info.value.id).onReturn((payload) => {
        if (payload === 'success') closeAndRefetch();
      });
    };

    // props.window.doClose();

    return {
      info, departmentTypeList, groupList, create, save, remove,
    };
  },
};
</script>

<style>
</style>
