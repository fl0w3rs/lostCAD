module.exports = {
  message: 'calls:addNote',
  callback: async ({
    utils, socket, data, db,
  }) => {
    if (!socket.isAuthenticated) return;

    if (!data?.callId || !data?.text) return;

    const call = await db.cad.Call.findOne({ where: { id: data?.callId } });
    if (!call) return;

    const getName = async () => {
      const identifier = await socket.getCurrentIdentifier();
      const forumUser = await socket.getForumUser();
      return identifier.name || forumUser.name;
    };

    if (!call.notes) call.notes = '';
    call.notes = `[color=#9e9e9e][${utils.getTimeString()}][/color] [b]${utils.escapeHtml(await getName())}[/b]: ${utils.escapeHtml(data?.text)}[br]` + call.notes;

    await call.save();

    const calls = await utils.getCalls();
    socket.emit('updateActiveCalls', calls);
  },
};
