const { Op } = require('sequelize');

module.exports = {
  message: 'calls:attachUnits',
  callback: async ({
    socket, data, db, io,
  }) => {
    if (!socket.isAuthenticated) return;
    if (!await socket.isDepartmentTypeAvailable('dispatch')) return;

    if (!data?.callId || !data?.units) return;
    if (!data.units.length) return;

    const call = await db.cad.Call.findOne({ where: { id: data?.callId } });
    if (!call) return;

    const units = await db.cad.Unit.findAll({
      where: {
        id: {
          [Op.or]: data?.units || [],
        },
      },
    });

    for (let i = 0; i < units.length; i += 1) {
      units[i].callId = data.callId;
      await units[i].save();
    }

    io.updateAllUnits();
    io.updateActiveCalls();
  },
};
