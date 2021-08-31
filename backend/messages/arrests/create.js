module.exports = {
  message: 'arrests:create',
  callback: async ({
    socket, data, db, emitReturn,
  }) => {
    if (!socket.isAuthenticated) return;

    if (
      !await socket.isDepartmentTypeAvailable('police')
      && !await socket.isDepartmentTypeAvailable('dispatch')
    ) return;

    if (!data?.characterId) return;
    if (!data?.reasons?.length) return;

    const arrest = await db.cad.Arrest.create({
      characterId: data.characterId,
      reasons: data.reasons,
      data: data?.data || {},
    });

    await arrest.save();

    emitReturn(true);
  },
};
