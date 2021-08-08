module.exports = {
  message: 'unit/disband',
  callback: async ({ socket, io, db }) => {
    const user = await socket.getUser();

    const unit = await user.getUnit();

    const identifier = await db.cad.Identifier.findOne({
      where: { id: user.dataValues.currentIdentifier },
    });
    io.sendLogMessageToUnit(unit.dataValues.id, `${identifier.dataValues.name} расформировал(-а) юнит.`);

    await unit.destroy();

    socket.unitId = undefined;

    io.updateAllUnits();
  },
};
