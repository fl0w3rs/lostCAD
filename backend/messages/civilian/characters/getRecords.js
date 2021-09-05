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

    const arrests = character.arrests.map((val) => {
      const el = val.dataValues;

      el.reasons = JSON.parse(el.reasons);
      el.data = JSON.parse(el.data);

      return el;
    });

    const citations = character.citations.map((val) => {
      const el = val.dataValues;

      el.reasons = JSON.parse(el.reasons);
      el.data = JSON.parse(el.data);

      return el;
    });

    emitReturn({ arrests, citations });
  },
};
