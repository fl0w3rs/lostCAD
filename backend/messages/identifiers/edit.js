module.exports = {
  message: 'identifiers:edit',
  callback: async ({ db, socket, data }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('police')
      && !await socket.isDepartmentTypeAvailable('dispatch')
      && !await socket.isDepartmentTypeAvailable('fire')
    ) return;

    const identifier = await db.cad.Identifier.findOne({
      where: {
        id: data.id,
        userId: socket.userId,
      },
    });

    if (!identifier) return;

    const {
      name, callsign, rank, department, division,
    } = data;

    await db.cad.Identifier.update({
      name, callsign, rank, department, division,
    }, { where: { id: data.id } });

    await socket.updateIdentifiers();

    socket.emit('identifiers:editSuccess', []);
  },
};
