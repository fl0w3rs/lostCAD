module.exports = {
  message: 'units:switchPanic',
  callback: async ({
    socket, io, data, db,
  }) => {
    if (!socket.isAuthenticated) return;

    if (data?.dispatch) {
      if (
        !await socket.isDepartmentTypeAvailable('dispatch')
      ) return;

      const unit = await db.cad.Unit.findOne({ where: { id: data?.unitId } });
      if (!unit) return;

      unit.panic = !unit.dataValues.panic;
      await unit.save();

      if (unit.panic) io.emit('panic:sound');
    } else {
      if (
        !await socket.isDepartmentTypeAvailable('police')
        && !await socket.isDepartmentTypeAvailable('fire')
      ) return;

      const user = await socket.getUser();
      const unit = await user.getUnit();
      if (!unit) return;

      unit.panic = !unit.dataValues.panic;
      await unit.save();

      if (unit.panic) io.emit('panic:sound');
      io.sendDispatchLogMessage(`UNIT ${unit.dataValues.callsign}: ${unit.dataValues.panic ? 'включена' : 'выключена'} кнопка паники.`);
    }

    io.updateAllUnits();
  },
};
