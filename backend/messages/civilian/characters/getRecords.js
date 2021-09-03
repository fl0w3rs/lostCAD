module.exports = {
  message: 'characters:getRecords',
  callback: async ({
    data, socket, db, emitReturn,
  }) => {
    if (!socket.isAuthenticated) return;
    if (!data.characterId) return;

    const character = await db.cad.Character.findOne({
      where: { id: data.characterId },
      include: [
        { model: db.cad.Citation },
        { model: db.cad.Arrest },
      ],
    });

    emitReturn({ arrests: character.arrests, citations: character.citations });
  },
};
