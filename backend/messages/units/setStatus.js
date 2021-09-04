module.exports = {
  message: 'units:setStatus',
  callback: async ({
    socket, data, io, db, utils,
  }) => {
    if (!socket.isAuthenticated) return;

    const addCallLog = async ({ callId = null, unit = null }) => {
      if (!callId || !unit) return;

      let text = '';
      if (unit.status === 'onscene') {
        text = `${unit.callsign} прибыл на вызов.`;
      } else if (unit.status === 'enroute') {
        text = `${unit.callsign} находится в пути.`;
      } else return;

      const call = await db.cad.Call.findOne({ where: { id: callId } });
      if (call) {
        call.addLog({ text });
        await call.save();
      }
    };

    if (data?.dispatch) {
      // if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

      const unit = await db.cad.Unit.findOne({ where: { id: data?.unitId } });
      if (!unit) return;

      unit.status = data?.status;

      await unit.save();

      await addCallLog({
        callId: unit.callId,
        unit,
      });

      io.updateAllUnits();
      io.updateActiveCalls();

      utils.recalcUnitLoad();
    } else {
      if (
        !await socket.isDepartmentTypeAvailable('police')
        && !await socket.isDepartmentTypeAvailable('fire')
      ) return;

      const unit = await socket.getUnit();
      if (!unit) return;

      unit.status = data;
      await unit.save();

      await addCallLog({
        callId: unit.callId,
        unit,
      });

      io.updateActiveCalls();
      io.updateAllUnits();

      utils.recalcUnitLoad();
    }

    //
  },
};
