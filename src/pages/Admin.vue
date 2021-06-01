<template>
  <div class="admin-page full-width">
    <div class="q-pt-md q-px-lg row q-col-gutter-sm">
      <div class="col-12 col-md-6">
        <DepartmentList />
      </div>

    </div>
  </div>
</template>

<script>
import DepartmentList from 'components/admin/department/List.vue';

export default {
  name: 'AdminPage',
  components: { DepartmentList },
};
</script>
