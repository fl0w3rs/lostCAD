module.exports = {
  message: 'doPriority',
  callback: async ({ socket, io, db }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('police')
      && !await socket.isDepartmentTypeAvailable('dispatch')
      && !await socket.isDepartmentTypeAvailable('fire')
    ) return;

    const user = await socket.getUser();
    const identifier = await db.cad.Identifier.findOne({
      where: { id: user.dataValues.currentIdentifier },
    });

    io.sendDispatchLogMessage(`[b]${identifier.dataValues.name}[/b]: нажат приоритет.`);

    io.emit('doPriority', []);
  },
};
