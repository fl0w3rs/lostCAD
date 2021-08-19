module.exports = {
  message: 'dispatch:duty:requestCount',
  callback: async ({ socket, utils }) => {
    if (!socket.isAuthenticated) return;

    socket.emit('dispatch:duty:updateCount', await utils.getDispatchCount());
  },
};
