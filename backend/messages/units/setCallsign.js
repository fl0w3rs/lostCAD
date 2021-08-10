module.exports = {
  message: 'units:setCallsign',
  callback: async ({
    socket, data, io, db,
  }) => {
    const user = await socket.getUser();

    const unit = await user.getUnit();

    if (!unit) return;

    const oldCallsign = unit.dataValues.callsign;

    unit.callsign = data;

    await unit.save();

    await io.updateAllUnits();

    const identifier = await db.cad.Identifier.findOne({
      where: { id: user.dataValues.currentIdentifier },
    });
    io.sendLogMessageToUnit(unit.dataValues.id, `${identifier.dataValues.name} изменил(-а) маркировку с ${oldCallsign} на ${data}.`);
  },
};
