<template>
  <div class="home-page column items-center justify-center full-width">
    <q-img
      :src="require('../assets/logo.png')"
      style="max-height: 200px; max-width: 500px;"
    />
    <div
      class="q-mx-md q-mt-md full-width row justify-center"
    >
      <div
        class="col-10 col-sm-8 col-md-6 col-lg-4 row justify-center q-col-gutter-xs"
      >
        <div class="col-12 col-md-6" v-if="departments.civilian">
          <q-btn
            to="/civilian" color="white"
            icon="fa fa-male" class="full-width bg-grey-10"
            outline label="CIVILIAN"
          />
        </div>
        <div class="col-12 col-md-6" v-if="departments.police">
          <q-btn
            to="/police" color="white"
            icon="fa fa-shield-alt" class="full-width bg-grey-10"
            outline label="POLICE"
          />
        </div>
        <div class="col-12 col-md-6" v-if="departments.fire">
          <q-btn
            to="/fire" color="white"
            icon="fa fa-fire-extinguisher" class="full-width bg-grey-10"
            outline label="FIRE"
          />
        </div>
        <div class="col-12 col-md-6" v-if="departments.dispatch">
          <q-btn
            to="/dispatch" color="white"
            icon="fa fa-network-wired" class="full-width bg-grey-10"
            outline label="DISPATCH"
          />
        </div>
        <div class="col-12 col-md-6" v-if="isAdmin == true">
          <q-btn
            to="/admin" color="white"
            icon="fa fa-users-cog" class="full-width bg-grey-10"
            outline label="ADMIN"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'HomePage',

  setup() {
    const store = useStore();

    return {
      isAdmin: computed(() => store.getters['user/isAdmin']),
      departments: computed(() => store.getters['user/getDepartments']),
    };
  },
};
</script>
