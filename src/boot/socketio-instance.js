import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const instance = io('https://lostws.fl0w3rs.dev', { path: '/' });

instance.initWrapper = () => {
  const wrapper = {};

  wrapper.wrapperId = uuidv4();

  wrapper.listeners = [];

  wrapper.emit = (evt, payload, options = {}) => {
    const requestId = uuidv4();

    instance.emit(evt, { payload, wrapperId: wrapper.wrapperId, requestId });

    if (typeof options?.onReturn === 'function') {
      instance.once(`return_${requestId}`, (pl) => {
        options.onReturn(pl.data);
      });
    }
  };

  wrapper.listen = (evt, handler, options = {}) => {
    const callback = (payload) => {
      if (!options.ignoreWrapperID && payload.wrapperId !== wrapper.wrapperId) return;
      const data = payload.wrapperId ? payload.data : payload;
      handler(data);
    };

    wrapper.listeners.push({ event: evt, handler: callback });
  };

  wrapper.mount = () => {
    for (let i = 0; i < wrapper.listeners.length; i += 1) {
      const { event, handler } = wrapper.listeners[i];
      instance.on(event, handler);
    }
  };

  wrapper.unmount = () => {
    for (let i = 0; i < wrapper.listeners.length; i += 1) {
      const { event, handler } = wrapper.listeners[i];
      instance.off(event, handler);
    }
  };

  return wrapper;
};

export default instance;
