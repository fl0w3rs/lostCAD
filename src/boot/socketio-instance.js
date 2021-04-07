import { io } from 'socket.io-client';

export default io('https://lostws.fl0w3rs.dev', { path: '/' });
