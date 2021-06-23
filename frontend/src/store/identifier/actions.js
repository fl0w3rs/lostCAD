import $socket from 'src/boot/socketio-instance';

export function request() {
  $socket.emit('user/identifiers/request', {});
}
