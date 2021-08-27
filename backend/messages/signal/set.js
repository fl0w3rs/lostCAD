module.exports = {
  message: 'signal:set',
  callback: async ({
    utils, socket, io, data, emitReturn,
  }) => {
    if (!socket.isAuthenticated) return;
    if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

    if (!data) {
      emitReturn('error');
      return;
    }

    const newData = data.includes('clear') ? '' : data;

    await utils.settings.set('signal', newData);
    io.emit('updateSignal', newData);

    emitReturn('success');
  },
};
