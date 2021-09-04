module.exports = {
  message: 'calls:getArchived',
  callback: async ({ utils, socket, emitReturn }) => {
    if (!socket.isAuthenticated) return;

    const calls = await utils.getCalls(true);
    emitReturn(calls);
  },
};
