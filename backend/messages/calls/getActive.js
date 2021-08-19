module.exports = {
  message: 'calls:getActive',
  callback: async ({ utils, socket }) => {
    if (!socket.isAuthenticated) return;

    const calls = await utils.getCalls();
    socket.emit('updateActiveCalls', calls);
  },
};
