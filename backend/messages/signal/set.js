module.exports = {
  message: 'signal:set',
  callback: async ({
    utils, socket, io, data,
  }) => {
    if (!socket.isAuthenticated) return;
    if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

    if (!data) return;

    const newData = data.includes('clear') ? '0' : data;

    await utils.settings.set('signal', newData);

    io.emit('updateSignal', newData);
  },
};
