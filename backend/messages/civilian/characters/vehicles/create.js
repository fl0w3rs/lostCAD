module.exports = {
  message: 'characters:vehicles:create',
  callback: async ({
    socket, db, data, Validator, vtemplates, emitMessage,
  }) => {
    if (!socket.isAuthenticated) return;

    if (!await socket.isDepartmentTypeAvailable('civilian')) return;

    const validation = new Validator(data, {
      ...vtemplates.rules.vehicle,
      character_owner: 'required',
    });

    validation.setAttributeNames({
      ...vtemplates.names.vehicle,
    });

    if (validation.fails()) {
      socket.emit('errorNotifyUnescaped', Object.values(validation.errors.all()).join('<br/>'));
      return;
    }

    const {
      mark, model, numberplate, vin, regStatus, insStatus, dor, color, type, character_owner,
    } = data;

    const char = await db.cad.Character.findOne({
      where: { id: character_owner, userId: socket.userId },
    });

    if (!char) {
      return;
    }

    await db.cad.Vehicle.create({
      mark,
      model,
      numberplate,
      vin,
      regStatus,
      insStatus,
      dor,
      color,
      type,
      userId: socket.userId,
      characterId: character_owner,
    });

    emitMessage('characters:vehicles:createSuccess');

    socket.updateVehicles();
  },
};
