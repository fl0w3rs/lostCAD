module.exports = {
  message: 'characters:vehicles:remove',
  callback: async ({
    socket, db, data, emitMessage,
  }) => {
    if (!socket.isAuthenticated) return;

    if (!await socket.isDepartmentTypeAvailable('civilian')) return;

    const vehicle = await db.cad.Vehicle.findOne({
      where: {
        userId: socket.userId,
        id: data.id,
      },
    });

    if (!vehicle) return;

    await db.cad.Vehicle.destroy({ where: { id: data.id } });

    emitMessage('characters:vehicles:removeSuccess', []);

    socket.updateVehicles();
  },
};
