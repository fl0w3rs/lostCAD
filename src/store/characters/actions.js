import $socket from 'src/boot/socketio-instance';

export function request() {
  $socket.emit('user/civilian/characters/get', {});
}
