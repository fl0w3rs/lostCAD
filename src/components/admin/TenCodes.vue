<template>
  <div>
    <q-markup-table
      class="col-12 shadow-0"
      dark
    >
      <thead>
        <tr>
          <th class="text-left">Код</th>
          <th class="text-center">Описание</th>
        </tr>
      </thead>
      <draggable
        v-model="codes"
        tag="tbody"
        item-key="code"
      >
        <template #item="{element}">
          <tr>
            <td>
              <span>
                {{ element.code }}
                <q-popup-edit
                  v-if="admin"
                  class="bg-dark"
                  v-model="element.code"
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
                {{ element.desc }}
                <q-popup-edit
                  v-if="admin"
                  class="bg-dark"
                  v-model="element.desc"
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
          </tr>
        </template>
      </draggable>
    </q-markup-table>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getTenCodes } from 'src/utils/api.js';
import draggable from 'vuedraggable';

export default {
  components: { draggable },
  props: {
    admin: { type: Boolean, required: false, default: false },
  },
  setup() {
    const codes = ref({});

    getTenCodes().then((result) => {
      codes.value = result;
    });

    return {
      codes,
    };
  },
};
</script>
