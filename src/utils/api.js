import $socket from 'src/boot/socketio-instance';

import { createCacheInstance } from 'src/utils/cache.js';

const cache = createCacheInstance();

export const getAvailableDepartments = () => new Promise((resolve) => {
  const cached = cache.get('availableDepartments');

  if (!cached) {
    const socketWrapper = $socket.initWrapper();
    socketWrapper.listen('user/responseDepartments', (data) => {
      socketWrapper.unmount();
      cache.set('availableDepartments', data.list, 60);
      resolve(data.list);
    });

    socketWrapper.mount();

    socketWrapper.emit('user/getAvailableDepartments');
  } else {
    resolve(cached);
  }
});

export const getAllGroupNames = () => new Promise((resolve) => {
  const cached = cache.get('allGroupNames');
  console.log(cached);

  if (!cached) {
    const socketWrapper = $socket.initWrapper();
    socketWrapper.listen('admin/getAllGroupNamesResponse', (data) => {
      socketWrapper.unmount();
      cache.set('allGroupNames', data.list, 60);
      resolve(data.list);
    });

    socketWrapper.mount();

    socketWrapper.emit('admin/getAllGroupNames');
  } else {
    resolve(cached);
  }
});
