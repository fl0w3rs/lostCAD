import { SocketWrapper } from 'src/boot/socketio-instance';

import { createCacheInstance } from 'src/utils/cache.js';

const cache = createCacheInstance();

export const getAvailableDepartments = () => new Promise((resolve) => {
  const cached = cache.get('availableDepartments');

  if (!cached) {
    const socketWrapper = new SocketWrapper({ hookComponentLifeCycle: false });

    socketWrapper.emit('user/getAvailableDepartments').onReturn((data) => {
      cache.set('availableDepartments', data.list, 60);
      resolve(data.list);
    });
  } else {
    resolve(cached);
  }
});

export const getAllGroupNames = () => new Promise((resolve) => {
  const cached = cache.get('allGroupNames');

  if (!cached) {
    const socketWrapper = new SocketWrapper({ hookComponentLifeCycle: false });

    socketWrapper.emit('admin/getAllGroupNames').onReturn((data) => {
      cache.set('allGroupNames', data.list, 60);
      resolve(data.list);
    });
  } else {
    resolve(cached);
  }
});

export const getTenCodes = () => new Promise((resolve) => {
  const socketWrapper = new SocketWrapper({ hookComponentLifeCycle: false });

  socketWrapper.emit('user/tenCodes/get', null).onReturn((data) => {
    resolve(JSON.parse(data));
  });
});

export const getPenalCode = () => new Promise((resolve) => {
  const socketWrapper = new SocketWrapper({ hookComponentLifeCycle: false });

  socketWrapper.emit('user/penalCode/get', null).onReturn((data) => {
    resolve(JSON.parse(data));
  });
});
