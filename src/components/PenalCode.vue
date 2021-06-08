<template>
  <div>
    <div
      class="text-center"
      v-if="admin"
    >
      <small>
        Элементы можно перемещать зажатием.<br />
        Для редактирования значения нажмите на необходимую ячейку.<br />
        Если штраф и/или время заключения не предусмотрено — оставьте ячейку пустой.
      </small>
    </div>

    <q-markup-table
      class="col-12 shadow-0"
      dark
    >
      <thead>
        <tr>
          <th class="text-left">Статья</th>
          <th class="text-center">Заголовок</th>
          <th class="text-center">Тип обвинения</th>
          <th class="text-center">Тип наказания</th>
          <th class="text-center">Сумма штрафа</th>
          <th class="text-center">Время заключения</th>
          <th v-if="admin"></th>
        </tr>
      </thead>

      <draggable
        v-model="penalCode"
        tag="tbody"
        item-key="article"
      >
        <template #item="{element, index}">
          <tr>
            <td>
              <span>
                {{ element.article }}
                <q-popup-edit
                  v-if="admin"
                  class="bg-dark"
                  v-model="element.article"
                  v-slot="scope"
                  buttons
                >
                  <q-input
                    dark
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
                {{ element.title }}
                <q-popup-edit
                  v-if="admin"
                  class="bg-dark"
                  v-model="element.title"
                  v-slot="scope"
                  buttons
                >
                  <q-input
                    dark
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
            <td class="text-center">
              <span>
                {{ element.chargeType }}
                <q-popup-edit
                  v-if="admin"
                  class="bg-dark"
                  v-model="element.chargeType"
                  v-slot="scope"
                  buttons
                >
                  <q-select
                    dark
                    color="white"
                    v-model="scope.value"
                    dense
                    autofocus
                    :options="chargeTypeList"
                  />
                </q-popup-edit>
              </span>
            </td>
            <td class="text-center">
              <span>
                {{ element.punishmentType }}
                <q-popup-edit
                  v-if="admin"
                  class="bg-dark"
                  v-model="element.punishmentType"
                  v-slot="scope"
                  buttons
                >
                  <q-select
                    dark
                    color="white"
                    v-model="scope.value"
                    dense
                    :options="punishmentTypeList"
                    autofocus
                  />
                </q-popup-edit>
              </span>
            </td>
            <td class="text-center">
              <span>
                {{
                  element.ticketAmount
                    ? `$${element.ticketAmount}`
                    : 'Не установлено'
                }}
                <q-popup-edit
                  v-if="admin"
                  class="bg-dark"
                  v-model="element.ticketAmount"
                  v-slot="scope"
                  buttons
                >
                  <q-input
                    dark
                    color="white"
                    v-model="scope.value"
                    dense
                    autofocus
                    type="number"
                    prefix="$"
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
                {{
                  element.imprisonmentTime
                    ? element.imprisonmentTime
                    : 'Не установлено'
                }}
                <q-popup-edit
                  v-if="admin"
                  class="bg-dark"
                  v-model="element.imprisonmentTime"
                  v-slot="scope"
                  buttons
                >
                  <q-input
                    dark
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
        </template>
        <template
          v-if="admin"
          #footer
        >
          <tr>
            <td>
              <q-input
                dark
                color="white"
                v-model="newArticle.article"
                dense
                outlined
                label="Статья"
              />
            </td>
            <td>
              <q-input
                dark
                color="white"
                v-model="newArticle.title"
                dense
                outlined
                label="Заголовок"
              />
            </td>
            <td>
              <q-select
                dark
                color="white"
                v-model="newArticle.chargeType"
                dense
                outlined
                :options="chargeTypeList"
                label="Тип обвинения"
              />
            </td>
            <td>
              <q-select
                dark
                color="white"
                v-model="newArticle.punishmentType"
                dense
                outlined
                :options="punishmentTypeList"
                label="Тип наказания"
              />
            </td>
            <td>
              <q-input
                dark
                color="white"
                v-model="newArticle.ticketAmount"
                dense
                outlined
                label="Сумма штрафа"
                type="number"
                prefix="$"
              />
            </td>
            <td>
              <q-input
                dark
                color="white"
                v-model="newArticle.imprisonmentTime"
                dense
                outlined
                label="Время заключения"
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
        </template>
      </draggable>
    </q-markup-table>
    <q-separator
      v-if="admin"
      dark
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

<script>
import {
  ref, reactive, onBeforeMount, onBeforeUnmount,
} from 'vue';
import { getPenalCode } from 'src/utils/api.js';
import draggable from 'vuedraggable';
import $socket from 'src/boot/socketio-instance';
import { useQuasar } from 'quasar';
import { punishmentTypeList, chargeTypeList } from 'src/utils/constants';

export default {
  components: { draggable },
  props: {
    admin: { type: Boolean, required: false, default: false },
    window: { type: Object },
  },
  setup(props) {
    const $q = useQuasar();
    const socketWrapper = $socket.initWrapper();

    onBeforeMount(socketWrapper.mount);
    onBeforeUnmount(socketWrapper.unmount);

    const penalCode = ref([]);
    const initialArticle = {
      article: '',
      title: '',
      chargeType: '',
      punishmentType: '',
      ticketAmount: '',
      imprisonmentTime: '',
    };
    const newArticle = reactive({ ...initialArticle });

    getPenalCode().then((result) => {
      penalCode.value = result;
    });

    const save = () => {
      socketWrapper.emit('admin/penalCode/edit', penalCode.value, {
        onReturn(data) {
          if (data === 'success') {
            $q.notify({
              type: 'positive',
              message: 'Penal Code успешно отредактирован',
              position: 'top',
            });
            props.window.closeFn();
          }
        },
      });
    };

    const remove = (key) => {
      penalCode.value.splice(key);
    };

    const create = () => {
      if (newArticle.article.length < 1 || newArticle.article.length > 10) return;
      if (newArticle.title.length < 1 || newArticle.title.length > 24) return;
      if (newArticle.chargeType.length < 1 || newArticle.chargeType.length > 24) return;
      if (newArticle.punishmentType.length < 1 || newArticle.punishmentType.length > 24) return;
      // if (newArticle.ticketAmount.length < 1 || newArticle.ticketAmount.length > 16) return;
      // eslint-disable-next-line max-len
      // if (newArticle.imprisonmentTime.length < 1 || newArticle.imprisonmentTime.length > 16) return;

      penalCode.value.push({ ...newArticle });

      Object.assign(newArticle, initialArticle);
    };

    return {
      penalCode,
      newArticle,
      save,
      remove,
      create,
      punishmentTypeList,
      chargeTypeList,
    };
  },
};
</script>
