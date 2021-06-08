<template>
  <div class="admin-page full-width">
    <div class="q-pt-md q-px-lg row q-col-gutter-sm">
      <div class="col-12 col-md-6">
        <DepartmentList />
      </div>
      <div class="col-12 col-md-6">
        <div class="bg-dark rounded-borders q-pa-sm">
          <div class="row q-gutter-sm justify-center">
            <q-btn
              color="blue"
              outline
              label="Редактировать 10-коды"
              @click="
                $store.commit('window/add', {
                  component: 'admin/TenCodes',
                  title: 'Редактирование 10-кодов',
                  params: { admin: true },
                  dialogMinWidth: '25vw',
                  dialog: true,
                })
              "
            />
            <q-btn
              color="orange"
              outline
              label="Редактировать Penal Code"
              @click="
                $store.commit('window/add', {
                  component: 'admin/PenalCode',
                  title: 'Редактирование Penal Code',
                  params: { admin: true },
                  dialogMinWidth: '25vw',
                  dialog: true,
                })
              "
            />

          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import DepartmentList from 'components/admin/department/List.vue';

export default {
  name: 'AdminPage',
  components: { DepartmentList },
  setup() {
    return {};
  },
};
</script>
