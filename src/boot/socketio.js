import VueSocketIOExt from 'vue-socket.io-extended';
import $socket from 'src/boot/socketio-instance';

export default async ({ app, store }) => {
  app.use(VueSocketIOExt, $socket, { store });
};
