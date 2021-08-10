module.exports = {
  message: 'units:join',
  callback: async ({
    socket, io, data, db,
  }) => {
    const user = await socket.getUser();
    user.unitId = data;
    await user.save();

    socket.unitId = data;

    await io.updateAllUnits();

    const identifier = await db.cad.Identifier.findOne({
      where: { id: user.dataValues.currentIdentifier },
    });
    io.sendLogMessageToUnit(data, `${identifier.dataValues.name} присоединился(-ась) к юниту.`);
  },
};
