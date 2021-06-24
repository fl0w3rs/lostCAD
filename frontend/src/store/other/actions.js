/*
export function someAction (context) {
}
*/

import $socket from 'src/boot/socketio-instance';

export function requestDispatchLog() {
  $socket.emit('dispatch/requestLog');
}

export function requestSignal100() {
  $socket.emit('getSignal100');
}

export function requestPriority() {
  $socket.emit('getPriority');
}
