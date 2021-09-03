module.exports = {
  message: 'calls:update',
  callback: async ({
    socket, data, db, io,
  }) => {
    if (!socket.isAuthenticated) return;
    // if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

    if (!data?.status || !data?.priority || !data?.type) return;

    const call = await db.cad.Call.findOne({ where: { id: data?.id } });
    if (!call) return;

    call.status = data.status;
    call.priority = data.priority;
    call.location = data.location || '';
    call.type = data.type;
    call.caller = data?.caller || '';
    call.description = data?.description || '';
    call.blockNumber = data?.blockNumber || null;

    await call.save();

    io.updateAllUnits();
    io.updateActiveCalls();
  },
};
