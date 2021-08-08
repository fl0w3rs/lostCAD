const { Op } = require('sequelize');

module.exports = {
  message: 'fld/request',
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
      'data.serial': 'present|string|max:16',
    });

    if (validation.fails()) {
      socket.emit('errorNotifyUnescaped', Object.values(validation.errors.all()).join('<br/>'));
      return;
    }

    const { serial } = payload.data;

    const weapons = await db.cad.Weapon.findAll({
      where: {
        serial: { [Op.like]: `%${serial}%` },
      },
      limit: 10,
    }) || [];

    emitMessage('fld/response', { results: weapons });
  },
};
