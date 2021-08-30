module.exports = {
  message: 'bolos:create',
  callback: async ({
    socket, db, utils, data, emitReturn, io,
  }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('dispatch')
    ) return;

    if (!data?.type) return;

    const bolo = await db.cad.Bolo.create({
      reasons: data?.reasons || [],
      data: data?.data || {},
      type: data?.type || 'custom',
      priority: data?.priority || 'low',
    });

    await bolo.save();

    const bolos = await utils.getBolos();
    io.emit('bolos:update', bolos);

    emitReturn(true);
  },
};
