module.exports = {
  message: 'unit/switchPanic',
  callback: async ({ socket, io }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('police')
            && !await socket.isDepartmentTypeAvailable('fire')
    ) return;

    const user = await socket.getUser();

    const unit = await user.getUnit();

    if (!unit) return;

    unit.panic = !unit.dataValues.panic;

    await unit.save();

    io.updateAllUnits();

    io.sendDispatchLogMessage(`UNIT ${unit.dataValues.callsign}: ${unit.dataValues.panic ? 'включена' : 'выключена'} кнопка паники.`);
  },
};
