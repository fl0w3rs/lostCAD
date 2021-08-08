module.exports = {
  message: 'dispatch/setSignal',
  callback: async ({
    utils, socket, io, data,
  }) => {
    if (!socket.isAuthenticated) return;
    if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

    if (!data) return;

    await utils.settings.set('signal', data);

    io.emit('updateSignal', data == 'clear' ? '0' : data);
  },
};
