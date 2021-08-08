module.exports = {
  message: 'unit/setStatus',
  callback: async ({ socket, data, io }) => {
    const user = await socket.getUser();

    const unit = await user.getUnit();

    if (!unit) return;

    unit.status = data;

    await unit.save();

    io.updateAllUnits();
  },
};
