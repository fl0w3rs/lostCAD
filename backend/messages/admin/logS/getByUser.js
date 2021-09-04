module.exports = {
  message: 'logs:getByUser',
  callback: async ({
    db, socket, emitReturn, data,
  }) => {
    if (!socket.isAuthenticated) return;
    if (!(await socket.isAdmin())) return;

    const logs = await db.cad.Log.findAll({ where: { userId: data } });

    emitReturn(logs);
  },
};
