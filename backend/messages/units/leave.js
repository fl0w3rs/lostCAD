module.exports = {
  message: 'units:leave',
  callback: async ({
    socket, io, db, utils,
  }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('police')
      && !await socket.isDepartmentTypeAvailable('fire')
    ) return;

    const user = await socket.getUser();
    const unit = await user.getUnit();
    if (!unit) return;

    const unitId = unit.id;
    user.unitId = null;
    await user.save();

    const members = await unit.getUsers();

    socket.unitId = undefined;

    const identifier = await db.cad.Identifier.findOne({
      where: { id: user.currentIdentifier },
    });

    if (identifier.id) {
      await io.sendLogMessageToUnit(unitId, `${identifier.name} покинул(-а) юнит.`);
    }

    if (members.length === 0) {
      await io.sendLogMessageToUnit(unitId, 'юнит расформирован из-за отсутствия участников.');
      await unit.destroy();

      utils.recalcUnitLoad();
    }

    await io.updateAllUnits();
  },
};
