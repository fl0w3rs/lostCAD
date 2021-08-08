module.exports = {
  message: 'user/civilian/characters/weapons/remove',
  callback: async ({
    socket, db, data, emitMessage,
  }) => {
    if (!socket.isAuthenticated) return;

    if (!await socket.isDepartmentTypeAvailable('civilian')) return;

    const { id } = data;

    const weap = await db.cad.Weapon.findOne({ where: { id, userId: socket.userId } });
    if (!weap) {
      return;
    }

    await db.cad.Weapon.destroy({ where: { id } });

    emitMessage('user/civilian/characters/weapons/removeSuccess');

    socket.updateWeapons();
  },
};
