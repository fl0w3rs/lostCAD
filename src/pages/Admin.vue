<template>
  <div class="admin-page column full-width q-pt-md q-px-lg text-center">
    <div class="accent rounded-borders">
        <DepartmentList />
    </div>
  </div>
</template>

<script>
import DepartmentList from 'components/admin/Departments.vue';

export default {
  name: 'AdminPage',
  components: { DepartmentList },
};
</script>
