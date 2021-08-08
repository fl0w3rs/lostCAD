module.exports = {
  message: 'user/civilian/characters/vehicles/edit',
  callback: async ({
    socket, db, data, Validator, vtemplates, emitMessage,
  }) => {
    if (!socket.isAuthenticated) return;

    if (!await socket.isDepartmentTypeAvailable('civilian')) return;

    const validation = new Validator(data, {
      ...vtemplates.rules.vehicle,
      id: 'required',
    });

    validation.setAttributeNames({
      ...vtemplates.names.vehicle,
    });

    if (validation.fails()) {
      socket.emit('errorNotifyUnescaped', Object.values(validation.errors.all()).join('<br/>'));
      return;
    }

    const vehicle = await db.cad.Vehicle.findOne({
      where: {
        userId: socket.userId,
        id: data.id,
      },
    });

    if (!vehicle) return;

    const {
      mark, model, numberplate, /* vin, */ regStatus, insStatus, dor, color, type,
    } = data;

    await db.cad.Vehicle.update({
      mark, model, numberplate, /* vin, */ regStatus, insStatus, dor, color, type,
    }, { where: { id: data.id } });

    emitMessage('user/civilian/characters/vehicles/editSuccess', []);

    socket.updateVehicles();
  },
};
