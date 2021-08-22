module.exports = {
  message: 'units:join',
  callback: async ({
    socket, io, data, db,
  }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('police')
      && !await socket.isDepartmentTypeAvailable('fire')
    ) return;

    const user = await socket.getUser({ skipCache: true });
    user.unitId = data;
    await user.save();

    socket.unitId = data;

    await io.updateAllUnits();

    const identifier = await db.cad.Identifier.findOne({
      where: { id: user.currentIdentifier },
    });

    io.sendLogMessageToUnit(data, `${identifier.name} присоединился(-ась) к юниту.`);
  },
};
