module.exports = {
  message: 'gameZone/set',
  callback: async ({
    data, io, socket, utils, emitReturn,
  }) => {
    if (!socket.isAuthenticated) return;
    if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

    if (data.length > 24) {
      socket.emit('errorNotifyUnescaped', 'Длинна строки должна быть от 0 до 24 символов');
      return;
    }

    if (data.length === 0) data = 'Не установлена';

    await utils.settings.set('gamezone', data);

    (await io.fetchSockets()).forEach((sock) => { sock.updateGameZone(); });

    emitReturn('success');
  },
};
