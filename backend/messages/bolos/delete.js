module.exports = {
  message: 'bolos:delete',
  callback: async ({
    socket, db, utils, data, emitReturn, io,
  }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('dispatch')
    ) return;

    const bolo = await db.cad.Bolo.findOne({ where: { id: data?.id } });
    if (!bolo) return;

    await bolo.destroy();

    const bolos = await utils.getBolos();
    io.emit('bolos:update', bolos);

    emitReturn(true);
  },
};
