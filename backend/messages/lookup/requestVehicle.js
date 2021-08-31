module.exports = {
  message: 'lookup/requestVehicle',
  callback: async ({
    socket, data, db, emitReturn,
  }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('police')
      && !await socket.isDepartmentTypeAvailable('dispatch')
      && !await socket.isDepartmentTypeAvailable('fire')
    ) return;

    const vehicle = await db.cad.Vehicle.findOne({ where: { id: data.id } });
    if (!vehicle) return;

    emitReturn({ data: vehicle });
  },
};
