module.exports = {
  message: 'dispatch:duty:requestDispatcherList',
  callback: async ({ socket, utils }) => {
    if (!socket.isAuthenticated) return;

    socket.emit('dispatch:duty:updateDispatcherList', await utils.getDispatcherList());
  },
};
