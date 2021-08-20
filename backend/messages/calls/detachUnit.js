module.exports = {
  message: 'calls:detachUnit',
  callback: async ({
    socket, data, db, io, utils,
  }) => {
    if (!socket.isAuthenticated) return;
    if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

    if (!data?.unitId) return;

    const unit = await db.cad.Unit.findOne({ where: { id: data?.unitId } });
    if (!unit) return;

    const call = await db.cad.Call.findOne({ where: { id: unit?.callId } });
    if (!call.notes) call.notes = '';
    call.notes = `[color=#9e9e9e][${utils.getTimeString()}][/color] [b]${utils.escapeHtml(await socket.getDisplayName({ dispatchPrefix: true }))}[/b] открепил юнит ${unit?.callsign}.[br]` + call.notes;
    await call.save();

    unit.callId = null;
    await unit.save();

    io.updateActiveCalls();
    io.updateAllUnits();
  },
};
