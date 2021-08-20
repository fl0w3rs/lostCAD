module.exports = {
  message: 'units:setStatus',
  callback: async ({ socket, data, io }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('police')
      && !await socket.isDepartmentTypeAvailable('fire')
    ) return;

    const user = await socket.getUser();
    const unit = await user.getUnit();

    if (!unit) return;

    unit.status = data;

    await unit.save();

    io.updateActiveCalls();
    io.updateAllUnits();
  },
};
