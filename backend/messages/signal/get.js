module.exports = {
  message: 'signal:get',
  callback: async ({ utils, socket }) => {
    if (!socket.isAuthenticated) return;

    const state = await utils.settings.get('signal');

    socket.emit('updateSignal', state);
  },
};
