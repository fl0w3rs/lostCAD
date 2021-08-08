const { Op } = require('sequelize');

module.exports = {
  message: 'dmv/request',
  callback: async ({
    socket, Validator, data, db, emitMessage,
  }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('police')
            && !await socket.isDepartmentTypeAvailable('dispatch')
            && !await socket.isDepartmentTypeAvailable('fire')
    ) return;

    const payload = data;

    const validation = new Validator(payload, {
      'data.numberplate': 'present|string|max:16',
      'data.vin': 'present|string|max:18',
    });

    if (validation.fails()) {
      socket.emit('errorNotifyUnescaped', Object.values(validation.errors.all()).join('<br/>'));
      return;
    }

    const { numberplate, vin } = payload.data;

    const conditions = [];

    if (numberplate) conditions.push({ numberplate: { [Op.like]: `%${numberplate}%` } });
    if (vin) conditions.push({ vin: { [Op.like]: `%${vin}%` } });

    const vehicles = await db.cad.Vehicle.findAll({
      where: {
        [Op.and]: conditions,
      },
      limit: 10,
    }) || [];

    emitMessage('dmv/response', { results: vehicles });
  },
};
