module.exports = {
  message: 'units:disband',
  callback: async ({
    socket, io, db, data,
  }) => {
    if (!socket.isAuthenticated) return;

    if (data?.dispatch) {
      if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

      const unit = await db.Unit.findOne({ where: { id: data?.unitId } });
      if (!unit) return;

      await unit.destroy();
    } else {
      const user = await socket.getUser();

      const unit = await user.getUnit();

      if (!unit) return;

      const identifier = await db.cad.Identifier.findOne({
        where: { id: user.dataValues.currentIdentifier },
      });

      io.sendLogMessageToUnit(unit.dataValues.id, `${identifier.dataValues.name} расформировал(-а) юнит.`);

      socket.unitId = undefined;

      await unit.destroy();
    }

    io.updateAllUnits();
  },
};
