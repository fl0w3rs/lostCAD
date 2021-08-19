module.exports = {
  message: 'dispatch:duty:setStatus',
  callback: async ({
    socket, data, utils, io,
  }) => {
    if (!socket.isAuthenticated) return;
    if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

    const user = await socket.getUser();

    user.dispatchStatus = data;

    await user.save();

    socket.emit('dispatch:duty:updateStatus', user.dispatchStatus);

    io.emit('dispatch:duty:updateCount', await utils.getDispatchCount());
  },
};
