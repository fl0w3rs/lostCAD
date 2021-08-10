module.exports = {
  message: 'lookup/requestCharacter',
  callback: async ({
    socket, data, db, emitMessage,
  }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('police')
      && !await socket.isDepartmentTypeAvailable('dispatch')
      && !await socket.isDepartmentTypeAvailable('fire')
    ) return;

    const char = await db.cad.Character.findOne({ where: { id: data.id } });
    if (!char) return;

    emitMessage('lookup/responseCharacter', { data: char });
  },
};
