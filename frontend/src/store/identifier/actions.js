import { socketInstance } from 'src/boot/socketio-instance';

export function request() {
  socketInstance.emit('identifiers:request', {});
}
