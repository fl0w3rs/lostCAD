module.exports = {
  message: 'units:setCallsign',
  callback: async ({
    socket, data, io, db,
  }) => {
    if (!socket.isAuthenticated) return;

    if (data?.dispatch) {
      // if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

      const unit = await db.cad.Unit.findOne({ where: { id: data?.unitId } });
      if (!unit) return;

      unit.callsign = data.newCallsign?.toUpperCase();

      await unit.save();

      await io.updateAllUnits();
    } else {
      if (
        !await socket.isDepartmentTypeAvailable('police')
        && !await socket.isDepartmentTypeAvailable('fire')
      ) return;

      const user = await socket.getUser();
      const unit = await user.getUnit();
      if (!unit) return;

      const oldCallsign = unit.callsign;
      unit.callsign = data?.toUpperCase();

      await unit.save();
      await io.updateAllUnits();

      const identifier = await db.cad.Identifier.findOne({
        where: { id: user.currentIdentifier },
      });

      io.sendLogMessageToUnit(unit.dataValues.id, `${identifier.dataValues.name} изменил(-а) маркировку с ${oldCallsign} на ${data.toUpperCase()}.`);
    }
  },
};
