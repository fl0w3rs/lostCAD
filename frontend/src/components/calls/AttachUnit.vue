<template>
  <div class="row q-col-gutter-xs">
    <div class="col-9">
      <q-select
        :options="availableUnits" emit-value map-options
        v-model="selectedUnits"
        multiple
        option-value="id"
        option-label="callsign"
        dense outlined
      />

    </div>
    <div class="col-3">
      <q-btn
        color="green" icon="check" outline class="full-height full-width" @click="attach"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { SocketWrapper } from 'src/boot/socketio-instance';
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  props: {
    callId: {
      type: Number,
    },
    window: Object,
  },
  setup(props: any) {
    const store = useStore();
    const socketWrapper = new SocketWrapper();

    const selectedUnits = ref([]);

    const attach = () => {
      socketWrapper.emit('calls:attachUnits', { callId: props.callId, units: selectedUnits.value });
      props.window.doClose();
    };

    return {
      availableUnits: computed(() => {
        const allUnits = store.getters['unit/getAllUnits'];
        const available: Array<any> = [];

        for (let i = 0; i < allUnits.length; i += 1) {
          // eslint-disable-next-line no-continue
          if (allUnits[i]?.callId > 0) continue;
          available.push(allUnits[i]);
        }

        return available;
      }),
      selectedUnits,

      attach,
    };
  },
});
</script>
