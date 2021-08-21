module.exports = {
  message: 'calls:addNote',
  callback: async ({
    utils, socket, data, db, io,
  }) => {
    if (!socket.isAuthenticated) return;

    if (!data?.callId || !data?.text) return;

    const call = await db.cad.Call.findOne({ where: { id: data?.callId } });
    if (!call) return;

    let name = '';
    if (data?.dispatcher) {
      const identifier = await socket.getCurrentIdentifier();
      const forumUser = await socket.getForumUser();
      name = identifier?.callsign || forumUser?.name;
    } else {
      const user = await socket.getUser();
      name = user?.unit?.callsign;
    }

    if (!call.notes) call.notes = '';
    call.notes = `[color=#9e9e9e]${utils.getTimeString()} | ${name || 'error'}[/color]: ${utils.escapeHtml(data?.text)}[br]` + call.notes;

    await call.save();

    io.emit('calls:sound:notify', call.id);

    io.updateActiveCalls();
  },
};
