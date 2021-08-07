import { socketInstance } from 'src/boot/socketio-instance';

export function request() {
  socketInstance.emit('user/civilian/characters/get', {});
}

export function requestVehicles() {
  socketInstance.emit('user/civilian/characters/vehicles/get', {});
}

export function requestWeapons() {
  socketInstance.emit('user/civilian/characters/weapons/get', {});
}
