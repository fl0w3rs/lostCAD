module.exports = {
  message: 'calls:detachUnit',
  callback: async ({
    socket, data, db, io,
  }) => {
    if (!socket.isAuthenticated) return;
    // if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

    if (!data?.unitId) return;

    const unit = await db.cad.Unit.findOne({ where: { id: data?.unitId } });
    if (!unit) return;

    const call = await db.cad.Call.findOne({ where: { id: unit.callId } });
    if (call) {
      call.addLog({ text: `${unit.callsign} откреплён диспетчером ${await socket.getDisplayName({ identifierCallsignPrefix: true })}.` });
      await call.save();
    }

    unit.callId = null;
    await unit.save();

    io.updateActiveCalls();
    io.updateAllUnits();
  },
};
