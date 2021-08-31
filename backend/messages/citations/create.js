module.exports = {
  message: 'citations:create',
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

    const citation = await db.cad.Citation.create({
      characterId: data.characterId,
      reasons: data.reasons,
      data: data?.data || {},
    });

    await citation.save();

    emitReturn(true);
  },
};
