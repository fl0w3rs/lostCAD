import VueSocketIOExt from 'vue-socket.io-extended';
import { io } from 'socket.io-client';

const socket = io('https://lostws.fl0w3rs.dev', { path: '/' });

export default async ({ Vue, store }) => {
  Vue.use(VueSocketIOExt, socket, { store });
};
