module.exports = {
  message: 'lookup/requestCharacter',
  callback: async ({
    socket, data, db, emitReturn, utils,
  }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('police')
      && !await socket.isDepartmentTypeAvailable('dispatch')
      && !await socket.isDepartmentTypeAvailable('fire')
    ) return;

    const char = await db.cad.Character.findOne({ where: { id: data.id } });
    if (!char) return;

    const charPlain = utils.convertToPlainObject(char);

    const bolos = utils.convertToPlainObject(await db.cad.Bolo.findOne({
      where: {
        'data.characterId': char.id,
      },
    }));

    emitReturn({ data: { ...charPlain, bolo: !!bolos } });
  },
};
