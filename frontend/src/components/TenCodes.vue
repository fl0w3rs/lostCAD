<template>
  <div>
    <div
      class="text-center"
      v-if="admin"
    >
      <small>
        Элементы можно перемещать зажатием.<br />
        Для редактирования значения нажмите на необходимую ячейку.<br />
        <span class="text-red text-h6 text-bold">Не используйте одинаковые коды.</span>
      </small>
    </div>

    <q-markup-table dense
      class="col-12 shadow-0 tableNoHoverEffect"
    >
      <thead>
        <tr>
          <th class="text-left">Код</th>
          <th class="text-center">Описание</th>
          <th v-if="admin"></th>
        </tr>
      </thead>

      <draggable
        v-model="codes"
        item-key="code"
        tag="transition-group"
        :move="() => admin"
      >
        <template #item="{element, index}">
          <tbody>
            <tr class="tc-table-border-bottom">
              <td>
                <span>
                  {{ element.code }}
                  <q-popup-edit
                    v-if="admin"
                    v-model="element.code"
                    v-slot="scope"
                    buttons
                  >
                    <q-input
                      color="white"
                      v-model="scope.value"
                      dense
                      autofocus
                      counter
                    >
                      <template v-slot:append>
                        <q-icon name="edit" />
                      </template>
                    </q-input>
                  </q-popup-edit>
                </span>
              </td>
              <td class="text-center">
                <span>
                  {{ element.desc }}
                  <q-popup-edit
                    v-if="admin"
                    v-model="element.desc"
                    v-slot="scope"
                    buttons
                  >
                    <q-input
                      color="white"
                      v-model="scope.value"
                      dense
                      autofocus
                    >
                      <template v-slot:append>
                        <q-icon name="edit" />
                      </template>
                    </q-input>
                  </q-popup-edit>
                </span>
              </td>
              <td v-if="admin">
                <q-btn
                  color="red"
                  size="sm"
                  label="Удалить"
                  outline
                  @click="remove(index)"
                />
              </td>
            </tr>
          </tbody>
        </template>
        <template
          v-if="admin"
          #footer
        >
          <tbody>
            <tr>
              <td>
                <q-input
                  color="white"
                  v-model="newCode.code"
                  dense
                  outlined
                  label="Код"
                />
              </td>
              <td>
                <q-input
                  color="white"
                  v-model="newCode.desc"
                  dense
                  outlined
                  label="Описание"
                />
              </td>
              <td>
                <q-btn
                  color="blue"
                  outline
                  label="Создать"
                  size="sm"
                  @click="create"
                />
              </td>
            </tr>
          </tbody>
        </template>
      </draggable>
    </q-markup-table>
    <q-separator
      v-if="admin"
      class="q-my-sm"
    />
    <div
      class="row justify-center"
      v-if="admin"
    >
      <q-btn
        label="Сохранить"
        color="green"
        outline
        @click="save"
      />
    </div>
  </div>
</template>

<style scoped>
td {
  border: 0 !important;
}

table > thead > tr > th:nth-child(1) {
  text-align: center;
  width: 96px;
}

table > tbody > tr > td:nth-child(1) {
  text-align: center;
}

.tc-table-border-bottom > td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.28) !important;
}
</style>

<script>
import {
  ref, reactive,
} from 'vue';
import { getTenCodes } from 'src/utils/api.js';
import draggable from 'vuedraggable';
import { SocketWrapper } from 'src/boot/socketio-instance';
import { useQuasar } from 'quasar';

export default {
  components: { draggable },
  props: {
    admin: { type: Boolean, required: false, default: false },
    window: { type: Object },
  },
  setup(props) {
    const $q = useQuasar();
    const socketWrapper = new SocketWrapper();

    const codes = ref([]);
    const newCode = reactive({
      code: '',
      desc: '',
    });

    getTenCodes().then((result) => {
      codes.value = result;
    });

    const save = () => {
      socketWrapper.emit('admin/tenCodes/edit', codes.value).onReturn((data) => {
        if (data === 'success') {
          $q.notify({
            type: 'positive',
            message: '10-коды успешно отредактированы',
          });
          props.window.doClose();
        }
      });
    };

    const remove = (key) => {
      codes.value.splice(key, 1);
    };

    const create = () => {
      if (newCode.code.length < 1 || newCode.code.length > 10) return;
      if (newCode.desc.length < 1 || newCode.desc.length > 32) return;

      codes.value.push({ ...newCode });

      newCode.code = '';
      newCode.desc = '';
    };

    return {
      codes,
      newCode,
      save,
      remove,
      create,
    };
  },
};
</script>
