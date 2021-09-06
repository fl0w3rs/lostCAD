module.exports = {
  message: 'calls:detachAllUnits',
  callback: async ({
    socket, data, db, io,
  }) => {
    if (!socket.isAuthenticated) return;
    // if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

    if (!data?.callId) return;

    const call = await db.cad.Call.findOne({ where: { id: data.callId }, include: db.cad.Unit });
    if (!call) return;

    for (let i = 0; i < call?.units?.length; i += 1) {
      call.units[i].callId = null;

      const unit = call.units[i];
      call.addLog({ text: `${unit.callsign} откреплён диспетчером ${await socket.getDisplayName({ identifierCallsignPrefix: true })}.` });

      await call.units[i].save();
    }

    await call.save();

    io.updateAllUnits();
    io.updateActiveCalls();
  },
};
