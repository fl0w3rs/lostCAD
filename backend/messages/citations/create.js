module.exports = {
  message: 'citations:create',
  callback: async ({
    socket, data, db, emitReturn,
  }) => {
    console.error(1);
    if (!socket.isAuthenticated) return;

    console.error(2);
    if (
      !await socket.isDepartmentTypeAvailable('police')
      && !await socket.isDepartmentTypeAvailable('dispatch')
    ) return;
    console.error(3);

    if (!data?.characterId) return;
    console.error(4);
    if (!data?.reasons?.length) return;
    console.error(5);

    const citation = await db.cad.Citation.create({
      characterId: data.characterId,
      reasons: data.reasons,
      data: data?.data || {},
    });

    await citation.save();

    emitReturn(true);
  },
};
