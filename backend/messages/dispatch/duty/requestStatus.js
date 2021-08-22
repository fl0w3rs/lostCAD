module.exports = {
  message: 'dispatch:duty:requestStatus',
  callback: async ({ socket, utils }) => {
    if (!socket.isAuthenticated) return;
    if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

    const user = await socket.getUser();

    socket.emit('dispatch:duty:updateStatus', user.dispatchStatus);

    utils.getDispatcherList();
  },
};
