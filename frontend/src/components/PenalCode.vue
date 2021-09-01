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
        <span class="text-red text-h6 text-bold">Не используйте одинаковые названия статей.</span>
      </small>
    </div>

    <div
      class="text-center"
      v-if="mode === 'select'"
    >
      <span class="text-orange text-h6 text-bold">Выберите статью</span>
    </div>

    <div class="row justify-end q-mb-sm">
      <q-input v-model="searchText" outlined label="Поиск" dense>

      </q-input>
    </div>

    <q-markup-table dense
      class="col-12 shadow-0 tableNoHoverEffect"
    >
      <thead>
        <tr>
          <th class="text-left">Статья</th>
          <th class="text-center">Заголовок</th>
          <th class="text-center">Вид нарушения</th>
          <th class="text-center">Изъятие лицензии на вождение</th>
          <th class="text-center">Изъятие лицензии на оружие</th>
          <th class="text-center">Эвакуация ТС</th>
          <th class="text-center">Штраф</th>
          <th class="text-center">Тюремное заключение</th>
          <th></th>
        </tr>
      </thead>

      <draggable
        v-model="penalCode"
        item-key="article"
        tag="transition-group"
        :move="() => admin"
        @end="onEnd"
      >
        <template #item="{element, index}">
          <tbody v-if="
            (element.article.includes(searchText) || element.title.includes(searchText))
            // eslint-disable-next-line max-len
            && (!onlyCitations || (Number(element.ticketAmount) > 0 && !element.imprisonmentTime.length))
            && (!onlyArrests || element.imprisonmentTime.length > 0)
          ">
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
                  {{ element.violationType }}
                  <q-popup-edit
                    v-if="admin"
                    v-model="element.violationType"
                    v-slot="scope"
                    buttons
                  >
                    <q-input
                      color="white"
                      v-model="scope.value"
                      dense
                      autofocus
                    />
                  </q-popup-edit>
                </span>
              </td>
              <!-- ВОждение -->
              <td class="text-center">
                <span>
                  {{ element.confiscateDriverLicense ? 'Да' : 'Нет' }}
                  <q-popup-edit
                    v-if="admin"
                    v-model="element.confiscateDriverLicense"
                    v-slot="scope"
                    buttons
                  >
                    <q-checkbox
                      v-model="scope.value" color="teal" label="Изъятие лицензии на вождение"
                    />
                  </q-popup-edit>
                </span>
              </td>
              <!-- Оружие -->
              <td class="text-center">
                <span>
                  {{ element.confiscateGunLicense ? 'Да' : 'Нет' }}
                  <q-popup-edit
                    v-if="admin"
                    v-model="element.confiscateGunLicense"
                    v-slot="scope"
                    buttons
                  >
                    <q-checkbox
                      v-model="scope.value" color="teal" label="Изъятие лицензии на оружие"
                    />
                  </q-popup-edit>
                </span>
              </td>
              <!-- Эвакуация -->
              <td class="text-center">
                <span>
                  {{ element.carEvacuation ? 'Да' : 'Нет' }}
                  <q-popup-edit
                    v-if="admin"
                    v-model="element.carEvacuation"
                    v-slot="scope"
                    buttons
                  >
                    <q-checkbox
                      v-model="scope.value" color="teal" label="Эвакуация авто"
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
                  v-if="mode === 'select'"
                  @click="processClick(element)" color="green"
                  size="sm" padding="xs" outline icon="check">

                </q-btn>

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
                colspan="9"
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
                <q-input
                  color="white"
                  v-model="newArticle.violationType"
                  dense
                  outlined
                  label="Вид нарушения"
                />
              </td>
              <td>
                <div class="row justify-center">
                  <q-checkbox v-model="newArticle.confiscateDriverLicense" />
                </div>
              </td>
              <td>
                <div class="row justify-center">
                  <q-checkbox v-model="newArticle.confiscateGunLicense" />
                </div>
              </td>
              <td>
                <div class="row justify-center">
                  <q-checkbox v-model="newArticle.carEvacuation" />
                </div>
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
              <td colspan="8">
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

table > thead > tr > th:nth-child(7) {
  width: 82px;
}

.pc-table-border-bottom > td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.28) !important;
}
</style>

<script>
import {
  ref, reactive,
} from 'vue';
import { getPenalCode } from 'src/utils/api.js';
import draggable from 'vuedraggable';
import { SocketWrapper } from 'src/boot/socketio-instance';
import { useQuasar } from 'quasar';

export default {
  components: { draggable },
  props: {
    admin: { type: Boolean, required: false, default: false },
    window: { type: Object },

    mode: { type: String },
    onClick: { type: Function },
    onlyCitations: { type: Boolean },
    onlyArrests: { type: Boolean },
  },
  setup(props) {
    const $q = useQuasar();
    const socketWrapper = new SocketWrapper();

    const searchText = ref('');
    const penalCode = ref([]);
    const initialArticle = {
      article: '',
      title: '',
      violationType: '',
      confiscateDriverLicense: false,
      confiscateGunLicense: false,
      carEvacuation: false,
      ticketAmount: '',
      imprisonmentTime: '',
      desc: '',
    };
    const newArticle = reactive({ ...initialArticle });

    getPenalCode().then((result) => {
      penalCode.value = result;
    });

    const processClick = (row) => {
      if (props.mode !== 'select') return;

      props.onClick(row);

      props.window.doClose();
    };

    const save = () => {
      for (let i = 0; i < penalCode.value.length; i += 1) {
        if (!penalCode.value[i].desc) penalCode.value[i].desc = '';
      }

      socketWrapper.emit('admin/penalCode/edit', penalCode.value).onReturn((data) => {
        if (data === 'success') {
          $q.notify({
            type: 'positive',
            message: 'Уголовный кодекс успешно отредактирован',
          });
          props.window.doClose();
        }
      });
    };

    const expands = ref({});

    const remove = (key) => {
      penalCode.value.splice(key, 1);
      delete expands.value[key];
    };

    const create = () => {
      const errorMessages = [];
      if (newArticle.article.length < 1 || newArticle.article.length > 10) errorMessages.push('Длинна статьи должна быть от 1 до 10 символов.');
      if (newArticle.title.length < 1 || newArticle.title.length > 128) errorMessages.push('Длинна заголовка должна быть от 1 до 128 символов.');
      if (newArticle.violationType.length < 1 || newArticle.violationType.length > 24) errorMessages.push('Длинна типа обвинения должна быть от 1 до 24 символов.');

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

    const onEnd = (evt) => {
      const tmp = expands.value[evt.oldIndex - 1];
      expands.value[evt.oldIndex - 1] = expands.value[evt.newIndex - 1];
      expands.value[evt.newIndex - 1] = tmp;
    };

    return {
      penalCode,
      newArticle,
      save,
      remove,
      create,

      onEnd,
      processClick,
      expands,
      searchText,
    };
  },
};
</script>
