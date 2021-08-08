module.exports = {
  message: 'getSignal',
  callback: async ({ utils, socket }) => {
    if (!socket.isAuthenticated) return;

    const state = await utils.settings.get('signal');

    socket.emit('updateSignal', state);
  },
};
