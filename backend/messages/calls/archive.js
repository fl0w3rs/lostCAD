module.exports = {
  message: 'calls:archive',
  callback: async ({
    socket, data, db, io,
  }) => {
    if (!socket.isAuthenticated) return;
    // if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

    if (!data?.callId) return;

    const call = await db.cad.Call.findOne({ where: { id: data.callId }, include: db.cad.Unit });
    if (!call) return;

    call.archived = true;
    await call.save();

    for (let i = 0; i < call?.units?.length; i += 1) {
      call.units[i].callId = null;
      await call.units[i].save();
    }

    io.updateAllUnits();
    io.updateActiveCalls();
  },
};
