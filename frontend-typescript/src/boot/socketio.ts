import VueSocketIOExt from 'vue-socket.io-extended';
import $socket from 'src/boot/socketio-instance';
import { boot } from 'quasar/wrappers';

export default boot(({ app, store }) => {
  app.use(VueSocketIOExt, $socket, { store });
});
