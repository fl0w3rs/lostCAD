module.exports = {
  message: 'calls:detachUnit',
  callback: async ({
    socket, data, db, io,
  }) => {
    if (!socket.isAuthenticated) return;
    if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

    if (!data?.unitId) return;

    const unit = await db.cad.Unit.findOne({ where: { id: data?.unitId } });
    if (!unit) return;

    unit.callId = null;
    await unit.save();

    io.updateActiveCalls();
    io.updateAllUnits();
  },
};
