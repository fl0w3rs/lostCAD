module.exports = {
  message: 'identifiers:create',
  callback: async ({ db, socket }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('police')
      && !await socket.isDepartmentTypeAvailable('dispatch')
      && !await socket.isDepartmentTypeAvailable('fire')
    ) return;

    const created = await db.cad.Identifier.create({
      userId: socket.userId, callsign: 'Не указан', name: 'Не указано', rank: 'Не указано', department: 'Не указано', division: 'Не указано',
    });

    socket.updateIdentifiers();

    socket.emit('identifiers:createSuccess', created);
  },
};
