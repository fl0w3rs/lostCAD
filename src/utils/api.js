import $socket from 'src/boot/socketio-instance';

const cache = {
  list: {
    // example: {
    //   existsUntil: Date.now(),
    //   value: 'lol',
    // },
  },

  get: (name) => {
    const that = cache;

    if (typeof that.list[name] !== 'object') return undefined;

    if (Date.now() > that.list[name].existsUntil) {
      delete that.list[name];
      return undefined;
    }

    return that.list[name];
  },

  set: (name, value, time) => {
    const that = cache;

    if (that.get(name) !== undefined) return false;

    that.list[name] = {
      existsUntil: Date.now() + time,
      value,
    };

    return true;
  },
};

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
