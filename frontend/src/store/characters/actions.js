import { socketInstance } from 'src/boot/socketio-instance';

export function request() {
  socketInstance.emit('characters:getAll', {});
}

export function requestVehicles() {
  socketInstance.emit('characters:vehicles:get', {});
}

export function requestWeapons() {
  socketInstance.emit('characters:weapons:get', {});
}
