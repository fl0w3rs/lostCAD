import $socket from 'src/boot/socketio-instance';

export function request() {
  $socket.emit('user/civilian/characters/get', {});
}

export function requestVehicles() {
  $socket.emit('user/civilian/characters/vehicles/get', {});
}
