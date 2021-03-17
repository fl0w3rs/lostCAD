import VueDraggableResizable from 'vue-draggable-resizable';
import 'vue-draggable-resizable/dist/VueDraggableResizable.css';

export default async ({ Vue }) => {
  Vue.component('vue-draggable-resizable', VueDraggableResizable);
};
