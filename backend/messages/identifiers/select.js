module.exports = {
  message: 'identifiers:select',
  callback: async ({ db, data, socket }) => {
    if (data !== null) {
      const identifier = await db.cad.Identifier.findOne({
        where: { id: data, userId: socket.userId },
      });
      if (!identifier) return;
    }

    const user = await socket.getUser();
    user.currentIdentifier = data;
    await user.save();

    socket.cache.clear('cadUser');
  },
};
