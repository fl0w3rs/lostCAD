import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const instance = io('https://lostws.fl0w3rs.dev', { path: '/' });

instance.initWrapper = () => {
  const wrapper = {};

  wrapper.rId = uuidv4();

  wrapper.listeners = [];

  wrapper.emit = (evt, data) => instance.emit(evt, { ...data, rId: wrapper.rId });
  wrapper.listen = (evt, handler) => {
    const callback = (data) => {
      if (data.rId !== wrapper.rId) return;
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
