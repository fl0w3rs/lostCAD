module.exports = {
  message: 'vehicleImpoundments:create',
  callback: async ({
    socket, data, db, emitReturn,
  }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('police')
      && !await socket.isDepartmentTypeAvailable('dispatch')
      && !await socket.isDepartmentTypeAvailable('fire')
    ) return;

    if (!data?.vehicleId) return;

    const vehicleImpoundment = await db.cad.VehicleImpoundment.create({
      vehicleId: data.vehicleId,
      data: data?.data || {},
    });

    await vehicleImpoundment.save();

    emitReturn(true);
  },
};
