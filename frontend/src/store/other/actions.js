/*
export function someAction (context) {
}
*/

import $socket from 'src/boot/socketio-instance';

export function requestDispatchLog() {
  $socket.emit('dispatch/requestLog');
}

export function requestSignal() {
  $socket.emit('getSignal');
}
