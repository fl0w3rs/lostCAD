<template>
  <div class="admin-page full-width">
    <div class="q-pt-md q-px-lg row q-col-gutter-sm">
      <div class="col-12 col-md-6">
        <DepartmentList />
      </div>
      <div class="col-12 col-md-6">
        <div class="bg-dark rounded-borders q-pa-sm">
          <div class="row q-gutter-sm justify-center">
            <ten-codes-button :admin='true' />
            <penal-code-button :admin='true' />

          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import DepartmentList from 'components/admin/department/List.vue';
import TenCodesButton from 'src/components/TenCodesButton.vue';
import PenalCodeButton from 'src/components/PenalCodeButton.vue';

export default {
  name: 'AdminPage',
  components: { DepartmentList, TenCodesButton, PenalCodeButton },
  setup() {
    return {};
  },
};
</script>
