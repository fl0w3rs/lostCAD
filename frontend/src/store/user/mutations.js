/*
export function someMutation (state) {
}
*/

import { socketInstance } from 'src/boot/socketio-instance';

export function requestDepartments(state, payload) {
  state.departments = payload;
}

export function updateInfo(state, payload) {
  state.name = payload.name;
  state.isAdmin = payload.isAdmin;
  state.departments = payload.departments;
}

export function setCurrentDepartment(state, payload) {
  if (state.currentDepartment !== payload) {
    socketInstance.emit('units:leave', null);
    socketInstance.emit('dispatch:duty:setStatus', 'off');
  }

  state.currentDepartment = payload;
}
