import Vue3DraggableResizable from 'vue3-draggable-resizable';

import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';

import { boot } from 'quasar/wrappers';

export default boot(async ({ app }) => {
  app.use(Vue3DraggableResizable);
});
