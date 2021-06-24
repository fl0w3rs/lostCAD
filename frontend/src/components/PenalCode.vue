<template>
  <div>
    <div
      class="text-center"
      v-if="admin"
    >
      <small>
        Элементы можно перемещать зажатием.<br />
        Для редактирования значения нажмите на необходимую ячейку.<br />
        Если штраф и/или время заключения не предусмотрено — оставьте ячейку пустой.<br />
        Не используйте одинаковые названия статей.
      </small>
    </div>

    <q-markup-table dense
      class="col-12 shadow-0 tableNoHoverEffect"
    >
      <thead>
        <tr>
          <th class="text-left">Статья</th>
          <th class="text-center">Заголовок</th>
          <th class="text-center">Тип обвинения</th>
          <th class="text-center">Тип наказания</th>
          <th class="text-center">Сумма штрафа</th>
          <th class="text-center">Время заключения</th>
          <th></th>
        </tr>
      </thead>

      <draggable
        v-model="penalCode"
        item-key="article"
        tag="transition-group"
      >
        <template #item="{element, index}">
          <tbody>
            <tr :class="expands[index] ? '' : 'pc-table-border-bottom'">
              <td>
                <span>
                  {{ element.article }}
                  <q-popup-edit
                    v-if="admin"
                    v-model="element.article"
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
                  {{ element.title }}
                  <q-popup-edit
                    v-if="admin"
                    v-model="element.title"
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
              <td class="text-center">
                <span>
                  {{ element.chargeType }}
                  <q-popup-edit
                    v-if="admin"
                    v-model="element.chargeType"
                    v-slot="scope"
                    buttons
                  >
                    <q-select
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
                    v-model="element.punishmentType"
                    v-slot="scope"
                    buttons
                  >
                    <q-select
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
                    v-model="element.ticketAmount"
                    v-slot="scope"
                    buttons
                  >
                    <q-input
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
                    v-model="element.imprisonmentTime"
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
              <td class="q-gutter-xs text-right">
                <q-btn
                  dense
                  round
                  flat
                  size="sm"
                  :icon="expands[index] ? 'arrow_drop_up' : 'arrow_drop_down'"
                  @click="expands[index] = !expands[index]"
                />
                <q-btn
                  v-if="admin"
                  padding="xs"
                  color="red"
                  size="sm"
                  icon="fa fa-trash"
                  outline
                  @click="remove(index)"
                />
              </td>
            </tr>
            <tr
              v-if="expands[index]"
              :class="expands[index] ? 'pc-table-border-bottom' : ''"
            >
              <td
                colspan="7"
                style="padding-top: 0!important;"
              >
                <p class="text-bold text-h6">Описание</p>
                <p>{{ element.desc || 'Не установлено' }}</p>
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
                    autogrow
                  >
                    <template v-slot:append>
                      <q-icon name="edit" />
                    </template>
                  </q-input>
                </q-popup-edit>
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
                  v-model="newArticle.article"
                  dense
                  outlined
                  label="Статья"
                />
              </td>
              <td>
                <q-input
                  color="white"
                  v-model="newArticle.title"
                  dense
                  outlined
                  label="Заголовок"
                />
              </td>
              <td>
                <q-select
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
                  color="white"
                  v-model="newArticle.imprisonmentTime"
                  dense
                  outlined
                  label="Время заключения"
                />
              </td>
              <td
                class="q-gutter-xs text-right"
                rowspan="2"
              >
                <q-btn
                  color="blue"
                  padding="xs"
                  outline
                  icon="fas fa-plus"
                  size="sm"
                  @click="create"
                />
              </td>
            </tr>

            <tr>
              <td colspan="6">
                <div class="row">
                  <div class="col-12">
                    <q-input
                      class="full-width"
                      color="white"
                      v-model="newArticle.desc"
                      dense
                      outlined
                      label="Описание"
                      autogrow
                    />

                  </div>
                </div>
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

.pc-table-border-bottom > td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.28) !important;
}
</style>

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
      desc: '',
    };
    const newArticle = reactive({ ...initialArticle });

    getPenalCode().then((result) => {
      penalCode.value = result;
    });

    const save = () => {
      for (let i = 0; i < penalCode.value.length; i += 1) {
        if (!penalCode.value[i].desc) penalCode.value[i].desc = '';
      }

      socketWrapper.emit('admin/penalCode/edit', penalCode.value, {
        onReturn(data) {
          if (data === 'success') {
            $q.notify({
              type: 'positive',
              message: 'Penal Code успешно отредактирован',
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
      const errorMessages = [];
      if (newArticle.article.length < 1 || newArticle.article.length > 10) errorMessages.push('Длинна статьи должна быть от 1 до 10 символов.');
      if (newArticle.title.length < 1 || newArticle.title.length > 128) errorMessages.push('Длинна заголовка должна быть от 1 до 128 символов.');
      if (newArticle.chargeType.length < 1 || newArticle.chargeType.length > 24) errorMessages.push('Длинна типа обвинения должна быть от 1 до 24 символов.');
      if (newArticle.punishmentType.length < 1 || newArticle.punishmentType.length > 24) errorMessages.push('Длинна типа наказания должна быть от 1 до 24 символов.');

      if (errorMessages.length !== 0) {
        $q.notify({
          type: 'negative',
          message: errorMessages.join('<br/>'),
          html: true,
        });
        return;
      }

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

      expands: ref({}),
    };
  },
};
</script>
