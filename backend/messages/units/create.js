module.exports = {
  message: 'units:create',
  callback: async ({
    socket, io, data, db, emitReturn,
  }) => {
    if (!socket.isAuthenticated) return;

    const user = await socket.getUser();
    const unit = await db.cad.Unit.create({ callsign: data.callsign, status: 'unavail', log: '' });

    user.unitId = unit.dataValues.id;
    await user.save();

    const identifier = await db.cad.Identifier.findOne({
      where: { id: user.dataValues.currentIdentifier },
    });
    io.sendLogMessageToUnit(unit.dataValues.id, `${identifier.dataValues.name} создал(-а) юнит.`);

    socket.unitId = unit.dataValues.id;

    io.updateAllUnits();
    emitReturn('success');
  },
};
