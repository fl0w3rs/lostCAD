module.exports = {
  message: 'units:disband',
  callback: async ({
    socket, io, db, data,
  }) => {
    if (!socket.isAuthenticated) return;

    if (data?.dispatch) {
      // if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

      const unit = await db.cad.Unit.findOne({ where: { id: data?.unitId } });
      if (!unit) return;

      await unit.destroy();

      io.updateAllUnits();
    } else {
      if (
        !await socket.isDepartmentTypeAvailable('police')
        && !await socket.isDepartmentTypeAvailable('fire')
      ) return;

      const unit = await socket.getUnit();
      if (!unit) return;

      const identifier = await socket.getCurrentIdentifier();

      await io.sendLogMessageToUnit(unit.id, `${identifier.name} расформировал(-а) юнит.`);

      socket.unitId = undefined;

      await unit.destroy();
      io.updateAllUnits();
    }
  },
};
