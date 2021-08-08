module.exports = {
  message: 'user/civilian/characters/delete',
  callback: async ({
    socket, Validator, db, data, emitMessage,
  }) => {
    if (!socket.isAuthenticated) return;

    if (!await socket.isDepartmentTypeAvailable('civilian')) return;

    const validation = new Validator(data, {
      id: 'required|numeric',
    });

    if (validation.fails()) {
      socket.emit('errorNotifyUnescaped', Object.values(validation.errors.all()).join('<br/>'));
      return;
    }

    const user = await socket.getForumUser();

    const character = await db.cad.Character.findOne({
      where: { id: data.id, userId: user.member_id },
    });
    if (!character) return;

    await db.cad.Character.destroy({ where: { id: character.id } });

    socket.sendAllCharacters(false);

    emitMessage('user/civilian/characters/deleteSuccess');
  },
};
