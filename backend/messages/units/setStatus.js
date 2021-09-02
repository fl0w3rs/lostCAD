module.exports = {
  message: 'units:setStatus',
  callback: async ({
    socket, data, io, db,
  }) => {
    if (!socket.isAuthenticated) return;

    if (data?.dispatch) {
      // if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

      const unit = await db.cad.Unit.findOne({ where: { id: data?.unitId } });
      if (!unit) return;

      unit.status = data?.status;

      await unit.save();

      io.updateAllUnits();
      io.updateActiveCalls();
    } else {
      if (
        !await socket.isDepartmentTypeAvailable('police')
        && !await socket.isDepartmentTypeAvailable('fire')
      ) return;

      const unit = await socket.getUnit();
      if (!unit) return;

      unit.status = data;
      await unit.save();

      io.updateActiveCalls();
      io.updateAllUnits();
    }

    //
  },
};
