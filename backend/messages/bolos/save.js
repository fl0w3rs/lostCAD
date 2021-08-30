module.exports = {
  message: 'bolos:save',
  callback: async ({
    socket, db, utils, data, emitReturn,
  }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('dispatch')
    ) return;

    const bolo = await db.cad.Bolo.findOne({ where: { id: data?.id } });
    if (!bolo) return;

    bolo.reasons = data?.reasons || [];
    bolo.data = data?.data || {};
    bolo.type = data?.type;

    await bolo.save();

    const bolos = await utils.getBolos();
    socket.emit('bolos:update', bolos);

    emitReturn(true);
  },
};
