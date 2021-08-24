module.exports = {
  message: 'dispatch:duty:forceStop',
  callback: async ({
    socket, data, utils, io, db,
  }) => {
    if (!socket.isAuthenticated) return;
    if (
      !await socket.isDepartmentTypeAvailable('dispatch')
      && !await socket.isAdmin()
    ) return;

    const user = await db.cad.User.findOne({ where: { id: data?.userId || 0 } });
    if (!user) return;

    user.dispatchStatus = 'off';
    await user.save();

    (await io.fetchSockets()).forEach((sock) => {
      if (sock.userId == user.fid) sock.emit('dispatch:duty:updateStatus', 'off');
    });

    io.emit('dispatch:duty:updateDispatcherList', await utils.getDispatcherList());
  },
};
