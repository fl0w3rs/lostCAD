/*
export function someAction (context) {
}
*/

import { socketInstance } from 'src/boot/socketio-instance';

export function requestDispatchLog() {
  socketInstance.emit('dispatch/requestLog');
}

export function requestSignal() {
  socketInstance.emit('getSignal');
}
